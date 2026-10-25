const express = require("express");
const {
  uploadAndAnalyzeResume,
  listResumes,
  getResume,
  downloadResume,
  updateResume,
  deleteResume,
} = require("../controllers/resumeController");
const requireAuth = require("../middleware/authMiddleware");
const { uploadResumeFile } = require("../middleware/uploadMiddleware");
const authorizeResumeOwner = require("../middleware/authorizeResumeOwner");

const router = express.Router();

// Authenticate before Multer so storage is always scoped to a known user.
router.use(requireAuth);

// Load each resume ID only when it belongs to the authenticated user.
router.param("id", authorizeResumeOwner);

router.post("/upload", uploadResumeFile, uploadAndAnalyzeResume);
router.get("/", listResumes);
router.get("/:id/file", downloadResume);
router.get("/:id", getResume);
router.patch("/:id", updateResume);
router.delete("/:id", deleteResume);

module.exports = router;
