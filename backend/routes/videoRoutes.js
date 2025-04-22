const express = require("express");
const {
  getAllVideos,
  uploadVideo,
  getVideoById,
  likeVideo,
  dislikeVideo,
} = require("../controllers/videoController");
require("../controllers/videoController").default;
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", getAllVideos);
router.post("/upload", upload.single("video"), uploadVideo);
router.get("/:id", getVideoById);
router.patch("/:id/likes", likeVideo);
router.patch("/:id/dislikes", dislikeVideo);

module.exports = router;
