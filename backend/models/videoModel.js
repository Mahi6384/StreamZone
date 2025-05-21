const mongoose = require("mongoose");

// creating schema
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, trim: true },
  creator: { type: String, default: "Uploaded By: Anonymous" },
  filePath: { type: String },
  thumbnail: {
    type: String,
    default: "https://dummyimage.com/320x180/cccccc/000000&text=No+Thumbnail",
  },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
});

// creating the model
const Video = mongoose.model("Video", videoSchema);

// exporting the model
module.exports = Video;
