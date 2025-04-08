const multer = require("multer");
const path = require("path");

// Where and how to store the video
// make a storage function (to give uniqueName and destination)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb("Only video files allowed", false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
