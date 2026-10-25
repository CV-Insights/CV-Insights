const mongoose = require("mongoose");
const Resume = require("../models/Resume");

async function authorizeResumeOwner(req, res, next) {
  const resumeId = req.params.id;

  if (!mongoose.isObjectIdOrHexString(resumeId)) {
    return res.status(400).json({ error: "Resume ID is invalid." });
  }

  const resume = await Resume.findOne({
    _id: resumeId,
    owner: req.userId,
  });

  if (!resume) {
    return res.status(404).json({ error: "Resume not found." });
  }

  req.resume = resume;
  return next();
}

module.exports = authorizeResumeOwner;
