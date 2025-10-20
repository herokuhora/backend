const mongoose = require("mongoose")

const answerSchema = new mongoose.Schema({
  questionId: Number,
  questionIndex: Number,
  questionText: String,
  questionType: String,
  answer: mongoose.Schema.Types.Mixed,
  answerText: String,
  isCorrect: Boolean,
  points: Number,
  earnedPoints: Number,
})

const examSubmissionSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LiveExam",
    required: true,
  },
  answers: [answerSchema],
  score: {
    type: Number,
    default: 0,
  },
  totalPoints: {
    type: Number,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("ExamSubmission", examSubmissionSchema)
