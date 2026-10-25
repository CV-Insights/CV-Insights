const fs = require("node:fs/promises");
const path = require("node:path");
const { PDFParse } = require("pdf-parse");
const Resume = require("../models/Resume");
const { analyzeResume } = require("../services/resumeAnalysisService");
const { uploadRoot } = require("../middleware/uploadMiddleware");

const MAX_JOB_DESCRIPTION_LENGTH = 30000;
const MIN_RESUME_TEXT_LENGTH = 30;
const MAX_RESUME_TEXT_LENGTH = 100000;
const NO_JOB_KEYWORDS_ERROR =
  "No recognizable keywords were found in the job description. " +
  "Include role skills such as React, SQL, or project management.";

function validateJobDescription(value) {
  if (typeof value !== "string") {
    return null;
  }

  const jobDescription = value.trim();
  if (!jobDescription || jobDescription.length > MAX_JOB_DESCRIPTION_LENGTH) {
    return null;
  }

  return jobDescription;
}

async function extractTextFromPdf(filePath) {
  const fileBuffer = await fs.readFile(filePath);
  const hasPdfHeader = fileBuffer.subarray(0, 5).toString("ascii") === "%PDF-";

  if (!hasPdfHeader) {
    return {
      status: 400,
      error: "The uploaded file is not a valid PDF.",
    };
  }

  const parser = new PDFParse({ data: fileBuffer });

  try {
    const parsedPdf = await parser.getText();
    return {
      text: parsedPdf.text.replace(/\s+/g, " ").trim(),
    };
  } catch (error) {
    console.error("Could not read uploaded PDF:", error);
    return {
      status: 422,
      error: "The PDF could not be read. Please upload a valid, text-based PDF.",
    };
  } finally {
    await parser.destroy();
  }
}

function validateExtractedResumeText(text) {
  if (text.length < MIN_RESUME_TEXT_LENGTH) {
    return {
      status: 422,
      error: "No readable text was found. Scanned PDFs need OCR before analysis.",
    };
  }

  if (text.length > MAX_RESUME_TEXT_LENGTH) {
    return {
      status: 413,
      error: "The extracted resume text is too long to analyze.",
    };
  }

  return null;
}

function createResumeTitle(originalName) {
  return path.parse(originalName).name.slice(0, 120) || "Resume";
}

function toResumeListItem(resume) {
  return {
    ...resume.toObject(),
    id: resume._id,
  };
}

function validateResumeUpdates(body) {
  const updates = {};

  if (Object.prototype.hasOwnProperty.call(body, "title")) {
    const title = body.title;
    if (typeof title !== "string" || !title.trim()) {
      return { error: "Title cannot be empty." };
    }
    updates.title = title.trim();
  }

  if (Object.prototype.hasOwnProperty.call(body, "text")) {
    const text = body.text;
    if (
      typeof text !== "string" ||
      !text.trim() ||
      text.length > MAX_RESUME_TEXT_LENGTH
    ) {
      return { error: "Resume text is invalid or too long." };
    }
    updates.text = text;
  }

  if (Object.prototype.hasOwnProperty.call(body, "jobDescription")) {
    const jobDescription = validateJobDescription(body.jobDescription);
    if (!jobDescription) {
      return {
        error:
          `Enter a job description (up to ${MAX_JOB_DESCRIPTION_LENGTH.toLocaleString()} ` +
          "characters).",
      };
    }
    updates.jobDescription = jobDescription;
  }

  return { updates };
}

async function uploadAndAnalyzeResume(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: "Choose a PDF resume to upload." });
  }

  const uploadedPath = req.file.path;
  let keepUploadedFile = false;

  try {
    const jobDescription = validateJobDescription(req.body?.jobDescription);
    if (!jobDescription) {
      return res.status(400).json({
        error: "Enter a job description (up to 30,000 characters).",
      });
    }

    const pdfResult = await extractTextFromPdf(uploadedPath);
    if (pdfResult.error) {
      return res.status(pdfResult.status).json({ error: pdfResult.error });
    }

    const { text } = pdfResult;
    const textError = validateExtractedResumeText(text);
    if (textError) {
      return res.status(textError.status).json({ error: textError.error });
    }

    const analysis = analyzeResume(text, jobDescription);
    if (analysis.jobKeywords.length === 0) {
      return res.status(422).json({
        error: NO_JOB_KEYWORDS_ERROR,
      });
    }

    const resume = await Resume.create({
      owner: req.userId,
      title: createResumeTitle(req.file.originalname),
      originalName: path.basename(req.file.originalname).slice(0, 255),
      storedFileName: req.file.filename,
      mimeType: "application/pdf",
      size: req.file.size,
      text,
      jobDescription,
      analysis,
    });
    keepUploadedFile = true;

    return res.status(201).json({
      resume: {
        id: resume._id,
        title: resume.title,
        originalName: resume.originalName,
        size: resume.size,
        createdAt: resume.createdAt,
        analysis: resume.analysis,
      },
    });
  } finally {
    if (!keepUploadedFile) {
      await fs.rm(uploadedPath, { force: true });
    }
  }
}

async function listResumes(req, res) {
  const resumes = await Resume.find({ owner: req.userId })
    .select("-text -storedFileName")
    .sort({ updatedAt: -1 });

  res.json({
    resumes: resumes.map(toResumeListItem),
  });
}

async function getResume(req, res) {
  res.json({ resume: req.resume });
}

async function downloadResume(req, res, next) {
  const { originalName, storedFileName } = req.resume;

  if (!storedFileName) {
    return res.status(404).json({ error: "Resume file not found." });
  }

  const filePath = path.join(uploadRoot, req.userId, storedFileName);
  return res.download(filePath, originalName, (error) => {
    if (error && !res.headersSent) {
      next(error);
    }
  });
}

async function updateResume(req, res) {
  const { updates, error } = validateResumeUpdates(req.body || {});
  if (error) {
    return res.status(400).json({ error });
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      error: "Provide a title or resume text to update.",
    });
  }

  const resume = req.resume;

  if (updates.text || updates.jobDescription) {
    const resumeText = updates.text ?? resume.text;
    const jobDescription = updates.jobDescription ?? resume.jobDescription;
    const analysis = analyzeResume(resumeText, jobDescription);
    updates.analysis = analysis;
  }
  Object.assign(resume, updates);
  await resume.save();

  res.json({ resume });
}

async function deleteResume(req, res) {
  const resume = req.resume;
  await resume.deleteOne();

  if (resume.storedFileName) {
    await fs.rm(
      path.join(uploadRoot, req.userId, resume.storedFileName),
      { force: true }
    );
  }

  res.status(204).end();
}

module.exports = {
  uploadAndAnalyzeResume,
  listResumes,
  getResume,
  downloadResume,
  updateResume,
  deleteResume,
};
