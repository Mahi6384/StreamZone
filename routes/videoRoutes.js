const express = require("express");
const { getAllVideos, uploadVideo } = require("../controller/videoController");
require("../controller/videoController").default;
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", getAllVideos);
router.post("/upload", upload.single("video"), uploadVideo);

module.exports = router;
