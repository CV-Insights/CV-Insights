const fs = require("node:fs");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
const multer = require("multer");

const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_PDF_MIME_TYPES = new Set([
  "application/pdf",
  "application/octet-stream",
  "",
]);
const uploadRoot = path.resolve(__dirname, "../../uploads");

const storage = multer.diskStorage({
  destination(req, file, callback) {
    const userDirectory = path.join(uploadRoot, req.userId);
    fs.mkdir(userDirectory, { recursive: true }, (error) => {
      callback(error, userDirectory);
    });
  },
  filename(req, file, callback) {
    callback(null, `${randomUUID()}.pdf`);
  },
});

function acceptPdf(req, file, callback) {
  const hasPdfExtension =
    path.extname(file.originalname).toLowerCase() === ".pdf";
  const hasAllowedMimeType = ACCEPTED_PDF_MIME_TYPES.has(file.mimetype);

  if (!hasPdfExtension || !hasAllowedMimeType) {
    return callback(new Error("Only PDF resume files are accepted."));
  }

  callback(null, true);
}

const uploadResumeFile = multer({
  storage,
  fileFilter: acceptPdf,
  limits: { fileSize: MAX_UPLOAD_SIZE_BYTES, files: 1 },
}).single("resume");

module.exports = { uploadResumeFile, uploadRoot };
