import mongoose from "mongoose"

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["general", "exam", "class", "urgent"],
      default: "general",
    },
    targetYear: {
      type: String,
      enum: ["all", "2025", "2026", "2027", "2028"],
      default: "all",
    },
    createdBy: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

noticeSchema.index({ createdAt: -1, isActive: 1 })

const Notice = mongoose.model("Notice", noticeSchema)

export default Notice
