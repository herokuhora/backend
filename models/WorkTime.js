const mongoose = require("mongoose")

const workTimeSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  hours: {
    type: Number,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
})

// Compound index to ensure one entry per student per day
workTimeSchema.index({ studentId: 1, date: 1 }, { unique: true })

module.exports = mongoose.model("WorkTime", workTimeSchema)
