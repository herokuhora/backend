const mongoose = require("mongoose")

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["mcq", "poll", "writing"],
  },
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
    },
  ],
  correctAnswer: {
    type: String,
  },
  marks: {
    type: Number,
    default: 1,
  },
})

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    questions: [questionSchema],
    targetYear: {
      type: String,
      required: true,
      enum: ["all", "2025", "2026", "2027"],
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "live", "completed"],
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

module.exports = mongoose.model("Exam", examSchema)
