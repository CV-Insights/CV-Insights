const mongoose = require("mongoose");

const keywordDetailSchema = new mongoose.Schema(
  {
    term: { type: String, required: true },
    importance: {
      type: String,
      enum: ["critical", "high", "standard"],
      required: true,
    },
    weight: { type: Number, min: 1, required: true },
    matched: { type: Boolean, required: true },
    jobMentions: { type: Number, min: 0, required: true },
    resumeMentions: { type: Number, min: 0, required: true },
  },
  { _id: false }
);

const analysisSchema = new mongoose.Schema(
  {
    score: { type: Number, min: 0, max: 100, required: true },
    resumeKeywords: [{ type: String }],
    jobKeywords: [{ type: String }],
    matchedKeywords: [{ type: String }],
    missingKeywords: [{ type: String }],
    importantKeywords: [{ type: String }],
    keywordDetails: [keywordDetailSchema],
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    originalName: {
      type: String,
      required: true,
      maxlength: 255,
    },
    storedFileName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
      enum: ["application/pdf"],
    },
    size: {
      type: Number,
      required: true,
      min: 1,
      max: 10 * 1024 * 1024,
    },
    text: {
      type: String,
      required: true,
      maxlength: 100000,
    },
    jobDescription: {
      type: String,
      maxlength: 30000,
      default: "",
    },
    analysis: { type: analysisSchema, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
