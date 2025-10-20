const express = require("express")
const router = express.Router()
const WorkTime = require("../models/WorkTime")
const { verifyToken } = require("../middleware/auth")

// Get work time records for a student
router.get("/:studentId", verifyToken, async (req, res) => {
  try {
    const { studentId } = req.params
    const { days = 7 } = req.query

    // Get last N days
    const records = await WorkTime.find({ studentId }).sort({ date: -1 }).limit(Number.parseInt(days))

    res.json(records)
  } catch (error) {
    console.error("Fetch worktime error:", error)
    res.status(500).json({ error: "Failed to fetch work time records" })
  }
})

// Submit work time
router.post("/", verifyToken, async (req, res) => {
  try {
    const { studentId, date, hours } = req.body

    // Upsert (update if exists, create if not)
    const workTime = await WorkTime.findOneAndUpdate(
      { studentId, date },
      { hours, submittedAt: new Date() },
      { upsert: true, new: true },
    )

    res.json(workTime)
  } catch (error) {
    console.error("Submit worktime error:", error)
    res.status(500).json({ error: "Failed to submit work time" })
  }
})

module.exports = router
