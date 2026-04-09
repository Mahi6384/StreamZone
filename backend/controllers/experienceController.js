const Experience = require("../models/experienceModel");
const fs = require("fs/promises");
const { getCloudinary } = require("../utils/cloudinary");

function toPlain(doc) {
  if (!doc) return null;
  return doc.toObject ? doc.toObject() : { ...doc };
}

function getHelpfulList(exp) {
  const o = toPlain(exp);
  if (o.helpful && o.helpful.length) return o.helpful;
  return o.likes || [];
}

function getNotHelpfulList(exp) {
  const o = toPlain(exp);
  if (o.notHelpful && o.notHelpful.length) return o.notHelpful;
  return o.dislikes || [];
}

function getDiscussionList(exp) {
  const o = toPlain(exp);
  if (o.discussion && o.discussion.length) return o.discussion;
  return o.comments || [];
}

/** API-shaped object: canonical field names only */
function normalizeExperience(doc) {
  if (!doc) return null;
  const o = toPlain(doc);
  return {
    _id: o._id,
    title: o.title,
    description: o.description,
    candidate: o.candidate || o.creator || "Anonymous",
    candidateId: o.candidateId || o.creatorId,
    videoUrl: o.videoUrl || o.filePath,
    thumbnail: o.thumbnail,
    helpful: getHelpfulList(o),
    notHelpful: getNotHelpfulList(o),
    discussion: getDiscussionList(o),
    visibility: o.visibility || "public",
    company: o.company || "",
    role: o.role || "",
    experienceLevel: o.experienceLevel || "Other",
    interviewRounds: o.interviewRounds ?? 1,
    detailsNotes: o.detailsNotes || "",
    detailsNotesImages: Array.isArray(o.detailsNotesImages) ? o.detailsNotesImages : [],
    questions: Array.isArray(o.questions) ? o.questions : [],
    questionsNotes: o.questionsNotes || "",
    questionsNotesImages: Array.isArray(o.questionsNotesImages) ? o.questionsNotesImages : [],
    tips: o.tips || "",
    tipsNotes: o.tipsNotes || "",
    howToPrepare: o.howToPrepare || "",
    outcome: o.outcome || null,
    interviewRoundDetails: Array.isArray(o.interviewRoundDetails)
      ? o.interviewRoundDetails.map((r) => ({
          name: r.name || "",
          questionsText: r.questionsText || "",
          notes: r.notes || "",
          preparationTips: r.preparationTips || "",
          notesImages: Array.isArray(r.notesImages) ? r.notesImages : [],
        }))
      : [],
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}

function questionLinesFromText(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseInterviewRoundDetails(raw) {
  if (raw == null || raw === "") return [];
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((r) => ({
      name: String(r?.name ?? "").trim(),
      questionsText: String(r?.questionsText ?? "").trim(),
      notes: String(r?.notes ?? "").trim(),
      preparationTips: String(r?.preparationTips ?? "").trim(),
    }));
  } catch {
    return [];
  }
}

function flattenQuestionsFromRounds(rounds) {
  const out = [];
  for (const r of rounds) {
    const lines = questionLinesFromText(r.questionsText);
    const prefix = r.name ? `[${r.name}] ` : "";
    for (const line of lines) {
      out.push(prefix + line);
    }
  }
  return out;
}

function parseQuestions(raw) {
  if (raw == null || raw === "") return [];
  if (Array.isArray(raw)) {
    return raw.map(String).map((s) => s.trim()).filter(Boolean);
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map(String).map((s) => s.trim()).filter(Boolean);
    }
  } catch {
    /* single textarea: split lines */
  }
  return String(raw)
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Express may give string | string[] for repeated query keys */
function normalizeMultiParam(q) {
  if (q == null || q === "") return [];
  const arr = Array.isArray(q) ? q : [q];
  return arr.map((x) => String(x).trim()).filter(Boolean);
}

const getAllExperiences = async (req, res) => {
  try {
    const { search, company, role, experienceLevel, companies, roles, experienceLevels } =
      req.query;

    /** Public feed: exclude private; missing visibility (legacy) counts as public */
    const query = { visibility: { $ne: "private" } };
    const andParts = [];

    if (search) {
      const safe = escapeRegex(search);
      andParts.push({
        $or: [
          { title: { $regex: safe, $options: "i" } },
          { description: { $regex: safe, $options: "i" } },
          { company: { $regex: safe, $options: "i" } },
          { role: { $regex: safe, $options: "i" } },
        ],
      });
    }

    let companyTerms = normalizeMultiParam(companies);
    if (!companyTerms.length && company) companyTerms = normalizeMultiParam(company);
    if (companyTerms.length) {
      andParts.push({
        $or: companyTerms.map((c) => ({
          company: { $regex: escapeRegex(c), $options: "i" },
        })),
      });
    }

    let roleTerms = normalizeMultiParam(roles);
    if (!roleTerms.length && role) roleTerms = normalizeMultiParam(role);
    if (roleTerms.length) {
      andParts.push({
        $or: roleTerms.map((r) => ({
          role: { $regex: escapeRegex(r), $options: "i" },
        })),
      });
    }

    let levelTerms = normalizeMultiParam(experienceLevels);
    if (!levelTerms.length && experienceLevel) levelTerms = normalizeMultiParam(experienceLevel);
    if (levelTerms.length) {
      andParts.push({ experienceLevel: { $in: levelTerms } });
    }

    if (andParts.length) {
      query.$and = andParts;
    }

    const rows = await Experience.find(query).sort({ createdAt: -1 });
    res.json(rows.map(normalizeExperience));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const shareExperience = async (req, res, next) => {
  try {
    const needsCloudinary = (req.files?.video?.length || 0) > 0;
    if (
      needsCloudinary &&
      (!process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET)
    ) {
      return res.status(503).json({
        error:
          "File upload is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET on the server.",
      });
    }

    const cloudinary = getCloudinary();

    async function uploadLocalFile(file, { folder }) {
      if (!file?.path) return null;
      const isVideo = file.mimetype?.startsWith("video/");
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const publicId = isVideo ? `video-${uniqueSuffix}` : `image-${uniqueSuffix}`;
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder,
          resource_type: isVideo ? "video" : "image",
          public_id: publicId,
        });
        return result?.secure_url || result?.url || null;
      } finally {
        // Always attempt cleanup of temp files
        try {
          await fs.unlink(file.path);
        } catch {
          /* ignore cleanup errors */
        }
      }
    }

    const videoFile = req.files?.video?.[0];
    const url = await uploadLocalFile(videoFile, { folder: "insighthire/experiences" });
    const thumbnail = url ? url.replace(/\.[^/.]+$/, ".jpg") : undefined;

    const {
      title,
      description,
      candidate,
      visibility,
      candidateId,
      company,
      role,
      experienceLevel,
      interviewRounds,
      interviewRoundDetails: interviewRoundDetailsRaw,
      detailsNotes,
      questions: questionsRaw,
      questionsNotes,
      tips,
      tipsNotes,
      outcome,
    } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (!company || !String(company).trim()) {
      return res.status(400).json({ error: "Company is required" });
    }
    if (!role || !String(role).trim()) {
      return res.status(400).json({ error: "Role is required" });
    }
    if (!experienceLevel || !String(experienceLevel).trim()) {
      return res.status(400).json({ error: "Experience level is required" });
    }

    let parsedRoundDetails = parseInterviewRoundDetails(interviewRoundDetailsRaw).filter(
      (r) =>
        questionLinesFromText(r.questionsText).length > 0 ||
        String(r.notes || "").trim() ||
        String(r.name || "").trim() ||
        String(r.preparationTips || "").trim()
    );

    const hasStructuredRounds = parsedRoundDetails.some(
      (r) => questionLinesFromText(r.questionsText).length > 0
    );

    let questions;
    let roundsCount;

    if (hasStructuredRounds) {
      const allQuestionLines = parsedRoundDetails.flatMap((r) =>
        questionLinesFromText(r.questionsText)
      );
      if (!allQuestionLines.length) {
        return res.status(400).json({
          error: "Add at least one interview question in your rounds (one per line).",
        });
      }
      questions = flattenQuestionsFromRounds(parsedRoundDetails);
      roundsCount = parsedRoundDetails.length;
    } else {
      questions = parseQuestions(questionsRaw);
      if (!questions.length) {
        return res.status(400).json({
          error: "At least one interview question is required (add a line per question)",
        });
      }
      let rounds = parseInt(interviewRounds, 10);
      if (Number.isNaN(rounds) || rounds < 0) rounds = 1;
      roundsCount = rounds;
    }

    let vis = visibility === "private" ? "private" : "public";
    let outcomeVal = outcome;
    if (outcomeVal === "" || outcomeVal === undefined) outcomeVal = undefined;
    if (outcomeVal && !["selected", "rejected"].includes(outcomeVal)) {
      return res.status(400).json({ error: "Invalid outcome" });
    }

    const payload = {
      title: String(title).trim(),
      description: description ? String(description).trim() : "",
      candidate: candidate ? String(candidate).trim() : "Anonymous",
      visibility: vis,
      company: String(company).trim(),
      role: String(role).trim(),
      experienceLevel: String(experienceLevel).trim(),
      interviewRounds: roundsCount,
      questions,
      tips: tips ? String(tips).trim() : "",
    };
    if (hasStructuredRounds) {
      payload.interviewRoundDetails = parsedRoundDetails;
    }
    if (detailsNotes != null && String(detailsNotes).trim()) {
      payload.detailsNotes = String(detailsNotes).trim();
    }
    if (questionsNotes != null && String(questionsNotes).trim()) {
      payload.questionsNotes = String(questionsNotes).trim();
    }
    if (tipsNotes != null && String(tipsNotes).trim()) {
      payload.tipsNotes = String(tipsNotes).trim();
    }
    if (url) payload.videoUrl = url;
    if (thumbnail) payload.thumbnail = thumbnail;
    if (outcomeVal) payload.outcome = outcomeVal;

    if (candidateId && String(candidateId).match(/^[0-9a-fA-F]{24}$/)) {
      payload.candidateId = candidateId;
    }

    const created = new Experience(payload);
    await created.save();
    res.status(201).json(normalizeExperience(created));
  } catch (err) {
    console.error("Share experience error:", err);
    return next(err);
  }
};

const getExperienceById = async (req, res) => {
  try {
    const { id } = req.params;
    const viewerId = req.query.viewerId;

    const exp = await Experience.findById(id);
    if (!exp) {
      return res.status(404).json({ message: "Experience not found" });
    }

    const vis = exp.visibility || "public";
    if (vis === "private") {
      const owner =
        exp.candidateId?.toString() ||
        exp.creatorId?.toString() ||
        "";
      if (!viewerId || viewerId !== owner) {
        return res.status(403).json({ message: "This experience is private" });
      }
    }

    res.status(200).json(normalizeExperience(exp));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const toggleHelpful = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "userId required" });
    }

    const exp = await Experience.findById(id);
    if (!exp) return res.status(404).json({ message: "Experience not found" });

    let helpful = [...getHelpfulList(exp)];
    let notHelpful = [...getNotHelpfulList(exp)];

    if (helpful.some((uid) => uid.toString() === userId)) {
      helpful = helpful.filter((uid) => uid.toString() !== userId);
    } else {
      helpful.push(userId);
      notHelpful = notHelpful.filter((uid) => uid.toString() !== userId);
    }

    exp.helpful = helpful;
    exp.notHelpful = notHelpful;
    exp.likes = helpful;
    exp.dislikes = notHelpful;
    await exp.save();

    res.status(200).json({
      helpful: exp.helpful,
      notHelpful: exp.notHelpful,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update helpful" });
  }
};

const toggleNotHelpful = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "userId required" });
    }

    const exp = await Experience.findById(id);
    if (!exp) return res.status(404).json({ message: "Experience not found" });

    let helpful = [...getHelpfulList(exp)];
    let notHelpful = [...getNotHelpfulList(exp)];

    if (notHelpful.some((uid) => uid.toString() === userId)) {
      notHelpful = notHelpful.filter((uid) => uid.toString() !== userId);
    } else {
      notHelpful.push(userId);
      helpful = helpful.filter((uid) => uid.toString() !== userId);
    }

    exp.helpful = helpful;
    exp.notHelpful = notHelpful;
    exp.likes = helpful;
    exp.dislikes = notHelpful;
    await exp.save();

    res.status(200).json({
      helpful: exp.helpful,
      notHelpful: exp.notHelpful,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update reaction" });
  }
};

const addDiscussionMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, userName, text } = req.body;
    const exp = await Experience.findById(id);
    if (!exp) return res.status(404).json({ message: "Experience not found" });

    if (!exp.discussion) exp.discussion = [];
    if (!exp.discussion.length && exp.comments?.length) {
      exp.discussion = exp.comments;
    }
    exp.discussion.push({ userId, userName, text });
    exp.comments = exp.discussion;
    await exp.save();
    res.status(200).json(getDiscussionList(exp));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCandidateExperiences = async (req, res) => {
  try {
    const { userId } = req.params;
    const rows = await Experience.find({
      $or: [{ candidateId: userId }, { creatorId: userId }],
    }).sort({ createdAt: -1 });
    res.json(rows.map(normalizeExperience));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllExperiences,
  shareExperience,
  getExperienceById,
  toggleHelpful,
  toggleNotHelpful,
  addDiscussionMessage,
  getCandidateExperiences,
  normalizeExperience,
};
