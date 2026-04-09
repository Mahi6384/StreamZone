const multer = require("multer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const TMP_DIR = path.join(__dirname, "..", "uploads", "tmp");
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

// Store uploads on disk temporarily (Cloudinary upload happens in controller)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, TMP_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const base = file.mimetype?.startsWith("video/") ? "video" : "image";
    cb(null, `${base}-${unique}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/") || file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only video or image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 75 * 1024 * 1024, // 75MB limit
    // Large JSON in interviewRoundDetails must not be truncated (default can be tight on some setups)
    fieldSize: 12 * 1024 * 1024,
  },
});

module.exports = upload;
