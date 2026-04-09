const express = require("express");
const {
  getAllExperiences,
  shareExperience,
  shareExperienceJson,
  attachExperienceVideo,
  getExperienceById,
  toggleHelpful,
  toggleNotHelpful,
  addDiscussionMessage,
  getCandidateExperiences,
} = require("../controllers/experienceController");
const upload = require("../middleware/upload");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.get("/", getAllExperiences);
/** JSON create — reliable interviewRoundDetails (body parsed by server express.json). */
router.post("/", asyncHandler(shareExperienceJson));
router.get("/user/:userId", getCandidateExperiences);
router.post(
  "/upload",
  upload.fields([{ name: "video", maxCount: 1 }]),
  asyncHandler(shareExperience)
);
router.post(
  "/:id/attach-video",
  upload.single("video"),
  asyncHandler(attachExperienceVideo)
);
router.get("/:id", getExperienceById);
router.patch("/:id/helpful", toggleHelpful);
router.patch("/:id/not-helpful", toggleNotHelpful);
router.post("/:id/discussion", addDiscussionMessage);

module.exports = router;
