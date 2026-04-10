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
  updateExperience,
  deleteExperience,
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
router.patch("/:id/helpful", toggleHelpful);
router.patch("/:id/not-helpful", toggleNotHelpful);
router.post("/:id/discussion", addDiscussionMessage);
/** Explicit paths avoid any ambiguity with `/:id` across HTTP methods. */
router.patch("/update/:id", updateExperience);
router.put("/update/:id", updateExperience);
router.delete("/delete/:id", deleteExperience);
/**
 * Backwards-compatible aliases (some clients call `/:id` for edit/delete).
 * Method-specific routing keeps `GET /:id` working.
 */
router.patch("/:id", updateExperience);
router.put("/:id", updateExperience);
router.delete("/:id", deleteExperience);
router.get("/:id", getExperienceById);

module.exports = router;
