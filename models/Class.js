const mongoose = require("mongoose")

const classSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    youtubeLink: {
      type: String,
      required: true,
    },
    videoId: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    duration: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: "Video",
    },
    accessType: {
      type: String,
      enum: ["lifetime", "private"],
      default: "lifetime",
    },
    allowedStudents: [
      {
        type: String,
      },
    ],
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

module.exports = mongoose.model("Class", classSchema)
