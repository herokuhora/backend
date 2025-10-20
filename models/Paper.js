const mongoose = require("mongoose")

const paperSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["note", "past-paper", "model-paper"],
    },
    title: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    pdfLink: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    targetYear: {
      type: String,
      required: true,
      enum: ["all", "2025", "2026", "2027"],
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Paper", paperSchema)
