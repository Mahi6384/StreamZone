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
    const { title, description } = req.body;
    const newVideo = new Video({
      title,
      description,
      filePath: req.file.path,
    });
    await newVideo.save();

    res.status(201).json(newVideo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllVideos, uploadVideo };
