const mongoose = require("mongoose");

// creating schema
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, trim: true },
  creator: { type: String, default: "Uploaded By: Anonymous" },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filePath: { type: String },
  thumbnail: {
    type: String,
    default: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
  },
  likes: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  dislikes: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      userName: { type: String },
      text: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  visibility: { type: String, enum: ["public", "private"], default: "public" },
}, { timestamps: true });

// creating the model
const Video = mongoose.model("Video", videoSchema);

// exporting the model
module.exports = Video;
