const express = require("express")
const router = express.Router()
const LiveExam = require("../models/LiveExam")
const { verifyToken, isAdmin } = require("../middleware/auth")

// Get all exams
router.get("/", verifyToken, async (req, res) => {
  try {
    const { year } = req.query

    const query = {}
    if (year && year !== "all") {
      query.targetYear = year
    }

    const exams = await LiveExam.find(query).sort({ createdAt: -1 })
    res.json(exams)
  } catch (error) {
    console.error("Fetch exams error:", error)
    res.status(500).json({ error: "Failed to fetch exams" })
  }
})

// Get single exam
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const exam = await LiveExam.findById(req.params.id)
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" })
    }
    res.json(exam)
  } catch (error) {
    console.error("Fetch exam error:", error)
    res.status(500).json({ error: "Failed to fetch exam" })
  }
})

// Create exam (admin only)
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const exam = new LiveExam({
      ...req.body,
      createdBy: req.user.email,
    })

    await exam.save()
    res.status(201).json(exam)
  } catch (error) {
    console.error("Create exam error:", error)
    res.status(500).json({ error: "Failed to create exam" })
  }
})

// Delete exam (admin only)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await LiveExam.findByIdAndDelete(req.params.id)
    res.json({ message: "Exam deleted successfully" })
  } catch (error) {
    console.error("Delete exam error:", error)
    res.status(500).json({ error: "Failed to delete exam" })
  }
})

module.exports = router
