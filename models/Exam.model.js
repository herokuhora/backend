import mongoose from "mongoose"

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    enum: ["mcq", "essay", "short-answer"],
    default: "mcq",
  },
  options: [
    {
      text: String,
      isCorrect: Boolean,
    },
  ],
  correctAnswer: String,
  points: {
    type: Number,
    default: 1,
  },
  imageUrl: String,
})

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    examYear: {
      type: String,
      enum: ["2025", "2026", "2027", "2028", "all"],
      default: "all",
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPoints: {
      type: Number,
      required: true,
      default: 0,
    },
    questions: [questionSchema],
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    isLive: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String,
      required: true,
    },
    allowedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Calculate total points before saving
examSchema.pre("save", function (next) {
  if (this.questions && this.questions.length > 0) {
    this.totalPoints = this.questions.reduce((sum, q) => sum + (q.points || 1), 0)
  }
  next()
})

const Exam = mongoose.model("Exam", examSchema)

export default Exam
