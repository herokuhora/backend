const mongoose = require("mongoose")

const questionSchema = new mongoose.Schema({
  id: Number,
  type: {
    type: String,
    enum: ["mcq", "poll", "writing"],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  options: [String],
  correctAnswer: Number,
  points: {
    type: Number,
    default: 10,
  },
})

const liveExamSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    targetYear: {
      type: String,
      required: true,
      enum: ["all", "2025", "2026", "2027"],
    },
    duration: {
      type: Number,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    questions: [questionSchema],
    totalPoints: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "active", "completed"],
      default: "upcoming",
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

module.exports = mongoose.model("LiveExam", liveExamSchema)
