const Video = require("../models/videoModel");
// A function to show metadata of all the videos from the database
const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const uploadVideo = async (req, res) => {
  // importing title, des, filepath  from the req body
  // creating a new doc in db collection using model
  //   saving the newVideo
  try {
    const FilePath = `http://localhost:5000/uploads/${req.file.filename}`;
    const { title, description } = req.body;
    const newVideo = new Video({
      title,
      description,
      filePath: FilePath,
    });
    await newVideo.save();

    res.status(201).json(newVideo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// getting single video by id
const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video Not Found" });
    }
    res.status(200).json(video);
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ message: "Server Error" });
  }
};

const likeVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video Not Found" });
    }
    video.likes += 1;
    await video.save();
    res.status(200).json({ message: "Video Liked", likes: video.likes });
  } catch (err) {
    console.log("Error", err);
  }
};

const dislikeVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    video.dislikes += 1;
    await video.save();
    res
      .status(200)
      .json({ message: "Video disliked", dislikes: video.dislikes });
  } catch (err) {
    console.log("Error", err);
  }
};

module.exports = {
  getAllVideos,
  uploadVideo,
  getVideoById,
  likeVideo,
  dislikeVideo,
};
