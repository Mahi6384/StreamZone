const mongoose = require("mongoose");

// creating schema
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, trim: true },
  filePath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// creating the model
const Video = mongoose.model("Video", videoSchema);

// exporting the model
module.exports = Video;
