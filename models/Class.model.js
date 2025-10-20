import mongoose from "mongoose"

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  videoUrl: String,
  pdfUrl: String,
  order: {
    type: Number,
    default: 0,
  },
})

const classSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    teacher: {
      type: String,
      required: true,
    },
    targetYear: {
      type: String,
      enum: ["2025", "2026", "2027", "2028", "all"],
      default: "all",
    },
    lessons: [lessonSchema],
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

const Class = mongoose.model("Class", classSchema)

export default Class
