const express = require("express");
const {
  getAllVideos,
  uploadVideo,
  getVideoById,
  likeVideo,
  dislikeVideo,
  addComment,
  getUserVideos,
} = require("../controllers/videoController");
require("../controllers/videoController").default;
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", getAllVideos);
router.get("/user/:userId", getUserVideos);
router.post("/upload", upload.single("video"), uploadVideo);
router.get("/:id", getVideoById);
router.patch("/:id/likes", likeVideo);
router.patch("/:id/dislikes", dislikeVideo);
router.post("/:id/comments", addComment);

module.exports = router;
