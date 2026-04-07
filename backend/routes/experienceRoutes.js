const express = require("express");
const {
  getAllExperiences,
  shareExperience,
  getExperienceById,
  toggleHelpful,
  toggleNotHelpful,
  addDiscussionMessage,
  getCandidateExperiences,
} = require("../controllers/experienceController");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", getAllExperiences);
router.get("/user/:userId", getCandidateExperiences);
router.post("/upload", upload.single("video"), shareExperience);
router.get("/:id", getExperienceById);
router.patch("/:id/helpful", toggleHelpful);
router.patch("/:id/not-helpful", toggleNotHelpful);
router.post("/:id/discussion", addDiscussionMessage);

module.exports = router;
