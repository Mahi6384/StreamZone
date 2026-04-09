const mongoose = require("mongoose");

const discussionEntrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName: { type: String },
    text: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    candidate: { type: String, trim: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    /** @deprecated use candidate — kept for legacy documents */
    creator: { type: String, trim: true },
    /** @deprecated use candidateId */
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    videoUrl: { type: String },
    /** @deprecated use videoUrl */
    filePath: { type: String },

    thumbnail: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
    },

    helpful: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    notHelpful: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    /** @deprecated use helpful */
    likes: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    /** @deprecated use notHelpful */
    dislikes: { type: [mongoose.Schema.Types.ObjectId], default: [] },

    discussion: [discussionEntrySchema],
    /** @deprecated use discussion */
    comments: [discussionEntrySchema],

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    company: { type: String, trim: true, default: "" },
    role: { type: String, trim: true, default: "" },
    experienceLevel: {
      type: String,
      trim: true,
      default: "Other",
    },
    interviewRounds: { type: Number, default: 1, min: 0 },
    /** Per-round name, multiline questions, notes (optional; legacy docs omit this) */
    interviewRoundDetails: [
      {
        name: { type: String, default: "", trim: true },
        questionsText: { type: String, default: "", trim: true },
        notes: { type: String, default: "", trim: true },
        preparationTips: { type: String, default: "", trim: true },
        notesImages: { type: [String], default: [] },
      },
    ],
    detailsNotes: { type: String, default: "", trim: true },
    detailsNotesImages: { type: [String], default: [] },
    questions: { type: [String], default: [] },
    questionsNotes: { type: String, default: "", trim: true },
    questionsNotesImages: { type: [String], default: [] },
    tips: { type: String, default: "", trim: true },
    tipsNotes: { type: String, default: "", trim: true },
    howToPrepare: { type: String, default: "", trim: true },
    outcome: {
      type: String,
      enum: ["selected", "rejected"],
    },
  },
  { timestamps: true }
);

/** Single collection name preserves existing MongoDB data */
const Experience = mongoose.model("Experience", experienceSchema, "videos");

module.exports = Experience;
