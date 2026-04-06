const Video = require("../models/videoModel");
// A function to show metadata of all the videos from the database
const getAllVideos = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { visibility: "public" };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    const videos = await Video.find(query).sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No video file provided" });
    }
    const FilePath = req.file.path;
    const thumbnail = FilePath.replace(/\.[^/.]+$/, ".jpg");
    const { title, description, creator, visibility, creatorId } = req.body;
    
    const videoData = {
      title,
      description,
      creator: creator || "Anonymous",
      filePath: FilePath,
      thumbnail: thumbnail,
      visibility: visibility || "public",
    };

    // Only add creatorId if it's a valid hex string (prevents Mongoose errors)
    if (creatorId && creatorId.match(/^[0-9a-fA-F]{24}$/)) {
      videoData.creatorId = creatorId;
    }
    
    const newVideo = new Video(videoData);
    await newVideo.save();
    res.status(201).json(newVideo);
  } catch (err) {
    console.error("Upload Error:", err);
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
    const { userId } = req.body;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ message: "Video Not Found" });

    if (video.likes.includes(userId)) {
      video.likes = video.likes.filter((uid) => uid.toString() !== userId);
    } else {
      video.likes.push(userId);
      video.dislikes = video.dislikes.filter((uid) => uid.toString() !== userId);
    }

    await video.save();
    res.status(200).json({ likes: video.likes, dislikes: video.dislikes });
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ message: "Error liking video" });
  }
};

const dislikeVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    if (video.dislikes.includes(userId)) {
      video.dislikes = video.dislikes.filter((uid) => uid.toString() !== userId);
    } else {
      video.dislikes.push(userId);
      video.likes = video.likes.filter((uid) => uid.toString() !== userId);
    }

    await video.save();
    res.status(200).json({ likes: video.likes, dislikes: video.dislikes });
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ message: "Error disliking video" });
  }
};

const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, userName, text } = req.body;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    video.comments.push({ userId, userName, text });
    await video.save();
    res.status(200).json(video.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserVideos = async (req, res) => {
  try {
    const { userId } = req.params;
    const videos = await Video.find({ creatorId: userId }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllVideos,
  uploadVideo,
  getVideoById,
  likeVideo,
  dislikeVideo,
  addComment,
  getUserVideos,
};
