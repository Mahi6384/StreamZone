import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  HiDocumentAdd,
  HiCheckCircle,
  HiInformationCircle,
  HiVideoCamera,
  HiViewList,
  HiDocumentText,
  HiShieldCheck,
  HiPlus,
  HiTrash,
} from "react-icons/hi";
import toast from "react-hot-toast";
import { EXPERIENCES_API } from "../config/api";
import { Button } from "../components/ui/Button";
import {
  pageBg,
  panel,
  panelMuted,
  labelCls,
  inputCls,
  selectCls,
  textareaCls,
  headingPage,
} from "../theme/ui";
import { useTheme } from "../context/ThemeContext";

const LEVELS = ["Intern", "SDE1", "SDE2", "SDE3", "Senior", "Staff", "Other"];

const emptyRound = () => ({
  name: "",
  questionsText: "",
  notes: "",
  preparationTips: "",
});

function questionLinesTotal(rounds) {
  return rounds.flatMap((r) =>
    String(r.questionsText || "")
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

function publishErrorMessage(error) {
  const data = error.response?.data;
  if (typeof data === "string") {
    if (/<!DOCTYPE|<html|<title>Error|<pre>Internal Server Error/i.test(data)) {
      return "Server error while publishing. If you attached a video, ensure the API has Cloudinary env vars set.";
    }
    return data.length > 400 ? "Could not publish your experience. Try again." : data;
  }
  if (data && typeof data === "object") {
    return (
      data.error ||
      data.message ||
      error.message ||
      "Could not publish your experience. Try again."
    );
  }
  return error.message || "Could not publish your experience. Try again.";
}

function FormSection({ theme, icon: Icon, title, children }) {
  const border = theme === "dark" ? "border-slate-700" : "border-slate-200";
  return (
    <section
      className={`rounded-2xl p-6 sm:p-8 space-y-6 ${panelMuted(theme)}`}
    >
      <div className={`flex items-center gap-3 border-b pb-4 ${border}`}>
        {Icon ? (
          <Icon className="h-6 w-6 shrink-0 text-emerald-500" aria-hidden />
        ) : null}
        <h2 className={`text-lg font-bold ${headingPage(theme)}`}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

const ShareExperiencePage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id: editExperienceId } = useParams();
  const isEditMode = Boolean(editExperienceId);
  const [loadingExperience, setLoadingExperience] = useState(Boolean(editExperienceId));
  const [loadEditError, setLoadEditError] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("SDE1");
  const [rounds, setRounds] = useState([emptyRound()]);
  const [detailsNotes, setDetailsNotes] = useState("");
  const [questionsNotes, setQuestionsNotes] = useState("");
  const [tips, setTips] = useState("");
  const [tipsNotes, setTipsNotes] = useState("");
  const [outcome, setOutcome] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.id ?? user?._id;

  useEffect(() => {
    if (!editExperienceId) return;

    if (!userId) {
      toast.error("Sign in to edit an experience.");
      navigate("/", { replace: true });
      return;
    }

    let cancelled = false;
    const load = async () => {
      setLoadEditError(null);
      setLoadingExperience(true);
      try {
        const res = await axios.get(`${EXPERIENCES_API}/${editExperienceId}`, {
          params: { viewerId: userId },
        });
        if (cancelled) return;
        const ex = res.data;
        const owner = ex.candidateId != null ? String(ex.candidateId) : "";
        if (owner !== String(userId)) {
          toast.error("You can only edit your own experiences.");
          navigate(`/experience/${editExperienceId}`, { replace: true });
          return;
        }
        setTitle(ex.title || "");
        setDescription(ex.description || "");
        setCompany(ex.company || "");
        setRole(ex.role || "");
        setExperienceLevel(ex.experienceLevel || "SDE1");
        setVisibility(ex.visibility === "private" ? "private" : "public");
        setDetailsNotes(ex.detailsNotes || "");
        setQuestionsNotes(ex.questionsNotes || "");
        setTips(ex.tips || "");
        setTipsNotes(ex.tipsNotes || "");
        setOutcome(ex.outcome === "selected" || ex.outcome === "rejected" ? ex.outcome : "");

        const details = Array.isArray(ex.interviewRoundDetails) ? ex.interviewRoundDetails : [];
        if (details.length > 0) {
          setRounds(
            details.map((r) => ({
              name: r.name || "",
              questionsText: r.questionsText || "",
              notes: r.notes || "",
              preparationTips: r.preparationTips || "",
            })),
          );
        } else if (Array.isArray(ex.questions) && ex.questions.length > 0) {
          setRounds([
            {
              name: "",
              questionsText: ex.questions.join("\n"),
              notes: "",
              preparationTips: "",
            },
          ]);
        } else {
          setRounds([emptyRound()]);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setLoadEditError(
            err.response?.status === 404
              ? "Experience not found."
              : "Could not load this experience for editing.",
          );
        }
      } finally {
        if (!cancelled) setLoadingExperience(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [editExperienceId, userId, navigate]);

  const updateRound = (index, patch) => {
    setRounds((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const addRound = () => setRounds((prev) => [...prev, emptyRound()]);

  const removeRound = (index) => {
    setRounds((prev) =>
      prev.length <= 1 ? prev : prev.filter((_, i) => i !== index),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to share an experience.");
      return;
    }

    const forSubmit = rounds.map((r) => ({
      name: r.name.trim(),
      questionsText: r.questionsText.trim(),
      notes: r.notes.trim(),
      preparationTips: r.preparationTips.trim(),
    }));

    const questionLines = questionLinesTotal(forSubmit);
    if (!questionLines.length) {
      toast.error(
        "Add at least one question across your interview rounds (one per line).",
      );
      return;
    }

    setUploading(true);

    const jsonBody = {
      title,
      description,
      candidate: user.name || "Anonymous",
      visibility,
      company,
      role,
      experienceLevel,
      interviewRoundDetails: forSubmit,
      structuredRounds: true,
      questions: questionLines,
      interviewRounds: forSubmit.length,
      tips,
    };
    if (userId) {
      if (isEditMode) jsonBody.userId = userId;
      else jsonBody.candidateId = userId;
    }
    if (detailsNotes) jsonBody.detailsNotes = detailsNotes;
    if (questionsNotes) jsonBody.questionsNotes = questionsNotes;
    if (tipsNotes) jsonBody.tipsNotes = tipsNotes;
    if (outcome) jsonBody.outcome = outcome;

    try {
      if (isEditMode) {
        await axios.put(
          `${EXPERIENCES_API}/update/${encodeURIComponent(String(editExperienceId).trim())}`,
          jsonBody,
        );
        let videoUploadFailed = false;
        if (file && editExperienceId) {
          const videoForm = new FormData();
          videoForm.append("video", file);
          try {
            await axios.post(
              `${EXPERIENCES_API}/${editExperienceId}/attach-video`,
              videoForm,
            );
          } catch (videoErr) {
            console.error(videoErr);
            videoUploadFailed = true;
            toast.error(
              publishErrorMessage(videoErr) ||
                "Experience saved, but the video could not be uploaded.",
            );
          }
        }
        if (!videoUploadFailed) {
          toast.success("Your experience was updated.");
        }
        navigate(`/experience/${editExperienceId}`);
      } else {
        const res = await axios.post(`${EXPERIENCES_API}`, jsonBody);
        const newId = res.data?._id;
        let videoUploadFailed = false;

        if (file && newId) {
          const videoForm = new FormData();
          videoForm.append("video", file);
          try {
            await axios.post(`${EXPERIENCES_API}/${newId}/attach-video`, videoForm);
          } catch (videoErr) {
            console.error(videoErr);
            videoUploadFailed = true;
            toast.error(
              publishErrorMessage(videoErr) ||
                "Experience saved, but the video could not be uploaded.",
            );
          }
        }

        if (!videoUploadFailed) {
          toast.success("Your experience was published.");
        }
        if (newId) {
          navigate(`/experience/${newId}`);
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(publishErrorMessage(error));
    } finally {
      setUploading(false);
    }
  };

  const mutedText = theme === "dark" ? "text-slate-300" : "text-slate-600";
  const sectionIconButton =
    theme === "dark"
      ? "text-red-400 hover:bg-red-950/40"
      : "text-red-600 hover:bg-red-50";

  const visibilityCard = (value, vtitle, vsubtitle, IconComp, selected) => {
    const ringSelected =
      theme === "dark"
        ? "border-emerald-500/60 bg-emerald-950/25"
        : "border-emerald-500/50 bg-emerald-50/60";
    const ringIdle =
      theme === "dark"
        ? "border-slate-700 bg-slate-900/40 hover:border-slate-600"
        : "border-slate-200 bg-white hover:border-slate-300";

    return (
      <label
        className={`relative flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors ${
          selected ? ringSelected : ringIdle
        }`}
      >
        <input
          type="radio"
          name="visibility"
          value={value}
          checked={visibility === value}
          onChange={() => setVisibility(value)}
          className="sr-only"
        />
        <IconComp
          className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500"
          aria-hidden
        />
        <div>
          <div className={`font-semibold ${headingPage(theme)}`}>{vtitle}</div>
          <p className={`mt-0.5 text-xs ${mutedText}`}>{vsubtitle}</p>
        </div>
      </label>
    );
  };

  if (isEditMode && loadingExperience) {
    return (
      <div
        className={`flex min-h-screen flex-col items-center justify-center pt-20 ${pageBg(theme)}`}
      >
        <span className="loading loading-spinner loading-lg text-emerald-500" />
        <p className="mt-4 text-sm text-slate-500">Loading experience…</p>
      </div>
    );
  }

  if (isEditMode && loadEditError) {
    return (
      <div className={`min-h-screen pt-24 pb-16 px-4 ${pageBg(theme)}`}>
        <div className="mx-auto max-w-lg text-center">
          <p className={`font-medium ${headingPage(theme)}`}>{loadEditError}</p>
          <Button
            theme={theme}
            variant="secondary"
            className="mt-6"
            type="button"
            onClick={() => navigate(-1)}
          >
            Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 pb-16 px-4 sm:px-8 ${pageBg(theme)}`}>
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/25">
            <HiDocumentAdd className="h-5 w-5" />
          </div>
          <div>
            <h1
              className={`text-2xl font-bold tracking-tight sm:text-3xl ${headingPage(theme)}`}
            >
              {isEditMode ? "Edit Interview" : "Add Interview"}
            </h1>
            <p
              className={`mt-2 max-w-2xl text-sm leading-relaxed ${mutedText}`}
            >
              {isEditMode
                ? "Update your write-up, visibility, or recording — changes apply when you save."
                : "Capture each round—questions, notes, and prep—plus overall tips for others."}
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          <FormSection
            theme={theme}
            icon={HiInformationCircle}
            title="Basic information"
          >
            <div>
              <label className={labelCls} htmlFor="se-title">
                Title
              </label>
              <input
                id="se-title"
                type="text"
                placeholder="e.g. Backend onsite — distributed systems focus"
                className={inputCls(theme)}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="se-company">
                  Company
                </label>
                <input
                  id="se-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  className={inputCls(theme)}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="se-role">
                  Role
                </label>
                <input
                  id="se-role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  placeholder="e.g. Software engineer"
                  className={inputCls(theme)}
                />
              </div>
            </div>

            <div>
              <label className={labelCls} htmlFor="se-level">
                Experience level
              </label>
              <select
                id="se-level"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                required
                className={selectCls(theme)}
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className={labelCls}>Visibility</span>
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {visibilityCard(
                  "public",
                  "Public",
                  "Shown in the Interview Playbook for all visitors.",
                  HiInformationCircle,
                  visibility === "public",
                )}
                {visibilityCard(
                  "private",
                  "Private",
                  "Only you can open it from My experiences.",
                  HiShieldCheck,
                  visibility === "private",
                )}
              </div>
            </div>
          </FormSection>

          <FormSection
            theme={theme}
            icon={HiVideoCamera}
            title="Video (optional)"
          >
            <p className={`text-sm ${mutedText}`}>
              MP4, MOV, or similar — a walkthrough of your interview experience.
              {isEditMode
                ? " Leave empty to keep your current video; choose a file only to replace it."
                : ""}
            </p>
            <input
              type="file"
              accept="video/*"
              id="file-upload"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label
              htmlFor="file-upload"
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-10 px-4 text-center text-sm transition-colors ${
                theme === "dark"
                  ? "border-slate-600 bg-slate-900/30 hover:border-emerald-500/40 hover:bg-slate-800/40"
                  : "border-slate-300 bg-white hover:border-emerald-400 hover:bg-slate-50/80"
              }`}
            >
              {file ? (
                <>
                  <HiCheckCircle className="text-emerald-500 h-8 w-8 shrink-0" />
                  <span
                    className={
                      theme === "dark" ? "text-slate-300" : "text-slate-700"
                    }
                  >
                    {file.name}
                  </span>
                </>
              ) : (
                <span className="text-slate-500">Choose recording file…</span>
              )}
            </label>
          </FormSection>

          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <HiViewList
                  className="h-6 w-6 shrink-0 text-emerald-500"
                  aria-hidden
                />
                <h2 className={`text-lg font-bold ${headingPage(theme)}`}>
                  Interview rounds
                </h2>
              </div>
              <button
                type="button"
                onClick={addRound}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                <HiPlus className="h-4 w-4" />
                Add round
              </button>
            </div>

            <div className="space-y-6">
              {rounds.map((r, index) => (
                <div
                  key={index}
                  className={`overflow-hidden rounded-2xl ${panel(theme)}`}
                >
                  <div
                    className={`flex items-center justify-between px-5 py-3 ${
                      theme === "dark"
                        ? "bg-emerald-950/30"
                        : "bg-emerald-50/80"
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Round {String(index + 1).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      disabled={rounds.length <= 1}
                      onClick={() => removeRound(index)}
                      className={`rounded-lg p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${sectionIconButton}`}
                      aria-label="Remove round"
                    >
                      <HiTrash className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-5 p-5 sm:p-6">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                      <div className="md:col-span-1">
                        <label
                          className={labelCls}
                          htmlFor={`se-round-name-${index}`}
                        >
                          Round name
                        </label>
                        <input
                          id={`se-round-name-${index}`}
                          type="text"
                          placeholder="e.g. Technical screening"
                          className={inputCls(theme)}
                          value={r.name}
                          onChange={(e) =>
                            updateRound(index, { name: e.target.value })
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label
                          className={labelCls}
                          htmlFor={`se-round-questions-${index}`}
                        >
                          Questions asked (one per line)
                        </label>
                        <textarea
                          id={`se-round-questions-${index}`}
                          placeholder="Paste or type each question on its own line."
                          rows={3}
                          className={textareaCls(theme)}
                          value={r.questionsText}
                          onChange={(e) =>
                            updateRound(index, {
                              questionsText: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        className={labelCls}
                        htmlFor={`se-round-notes-${index}`}
                      >
                        Notes &amp; strategies (optional)
                      </label>
                      <textarea
                        id={`se-round-notes-${index}`}
                        placeholder="What worked? What was the interviewer looking for?"
                        rows={3}
                        className={textareaCls(theme)}
                        value={r.notes}
                        onChange={(e) =>
                          updateRound(index, { notes: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label
                        className={labelCls}
                        htmlFor={`se-round-prep-${index}`}
                      >
                        Preparation tips (optional)
                      </label>
                      <textarea
                        id={`se-round-prep-${index}`}
                        placeholder="How to prepare specifically for this round (topics, format, timebox)."
                        rows={3}
                        className={textareaCls(theme)}
                        value={r.preparationTips}
                        onChange={(e) =>
                          updateRound(index, {
                            preparationTips: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <FormSection
            theme={theme}
            icon={HiDocumentText}
            title="Overall summary"
          >
            <p className={`text-sm ${mutedText}`}>
              High-level context: team, timeline, culture, or what stood out
              about the process.
            </p>
            <div>
              <label className={labelCls} htmlFor="se-summary">
                Summary
              </label>
              <textarea
                id="se-summary"
                placeholder="Brief overview for readers skimming your experience."
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className={textareaCls(theme)}
              />
            </div>
          </FormSection>

          <FormSection theme={theme} title="Other notes (optional)">
            <div>
              <label className={labelCls} htmlFor="se-details-notes">
                Interview details
              </label>
              <textarea
                id="se-details-notes"
                placeholder="Recruiter screen, take-home, format, scheduling — anything not tied to a single round."
                rows={3}
                value={detailsNotes}
                onChange={(e) => setDetailsNotes(e.target.value)}
                className={textareaCls(theme)}
              />
            </div>

            <div>
              <label className={labelCls} htmlFor="se-questions-notes">
                Extra context on questions (optional)
              </label>
              <textarea
                id="se-questions-notes"
                placeholder="Difficulty, follow-ups, or themes across rounds."
                rows={3}
                value={questionsNotes}
                onChange={(e) => setQuestionsNotes(e.target.value)}
                className={textareaCls(theme)}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="se-tips">
                  Tips
                </label>
                <textarea
                  id="se-tips"
                  placeholder="What would you repeat, or do differently?"
                  rows={4}
                  value={tips}
                  onChange={(e) => setTips(e.target.value)}
                  className={textareaCls(theme)}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="se-tips-notes">
                  Tips notes (optional)
                </label>
                <textarea
                  id="se-tips-notes"
                  placeholder="Links, resources, or what you wish you knew."
                  rows={4}
                  value={tipsNotes}
                  onChange={(e) => setTipsNotes(e.target.value)}
                  className={textareaCls(theme)}
                />
              </div>
            </div>

            <div>
              <label className={labelCls} htmlFor="se-outcome">
                Outcome (optional)
              </label>
              <select
                id="se-outcome"
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                className={selectCls(theme)}
              >
                <option value="">Prefer not to say</option>
                <option value="selected">Selected</option>
                <option value="rejected">Not selected</option>
              </select>
            </div>
          </FormSection>

          <div
            className={`flex flex-col-reverse items-stretch justify-end gap-3 border-t pt-8 sm:flex-row sm:items-center ${theme === "dark" ? "border-slate-800" : "border-slate-200"}`}
          >
            <Button
              theme={theme}
              variant="secondary"
              type="button"
              className="w-full sm:w-auto"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              theme={theme}
              variant="primary"
              type="submit"
              disabled={uploading}
              className="w-full sm:w-auto sm:min-w-[200px]"
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner loading-sm" />
                  {isEditMode ? "Saving…" : "Publishing…"}
                </span>
              ) : isEditMode ? (
                "Save changes"
              ) : (
                "Publish experience"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareExperiencePage;
