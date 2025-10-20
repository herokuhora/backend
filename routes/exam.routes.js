import express from "express"
import { verifyFirebaseToken, checkAdmin } from "../middleware/auth.middleware.js"
import Exam from "../models/Exam.model.js"

const router = express.Router()

// Get all active exams
router.get("/", verifyFirebaseToken, async (req, res) => {
  try {
    const now = new Date()
    const exams = await Exam.find({
      $or: [{ isPublic: true }, { allowedStudents: req.user.uid }],
      endTime: { $gte: now },
    }).sort({ startTime: 1 })

    res.json(exams)
  } catch (error) {
    console.error("Fetch exams error:", error)
    res.status(500).json({ error: "Failed to fetch exams" })
  }
})

// Get live exams
router.get("/live", verifyFirebaseToken, async (req, res) => {
  try {
    const now = new Date()
    const liveExams = await Exam.find({
      startTime: { $lte: now },
      endTime: { $gte: now },
      $or: [{ isPublic: true }, { allowedStudents: req.user.uid }],
    })

    res.json(liveExams)
  } catch (error) {
    console.error("Fetch live exams error:", error)
    res.status(500).json({ error: "Failed to fetch live exams" })
  }
})

// Get exam by ID
router.get("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" })
    }
    res.json(exam)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch exam" })
  }
})

// Create new exam (admin only)
router.post("/", verifyFirebaseToken, checkAdmin, async (req, res) => {
  try {
    const exam = new Exam({
      ...req.body,
      createdBy: req.user.uid,
    })
    await exam.save()
    res.status(201).json({ message: "Exam created successfully", exam })
  } catch (error) {
    console.error("Create exam error:", error)
    res.status(500).json({ error: "Failed to create exam" })
  }
})

// Update exam (admin only)
router.put("/:id", verifyFirebaseToken, checkAdmin, async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" })
    }
    res.json({ message: "Exam updated successfully", exam })
  } catch (error) {
    res.status(500).json({ error: "Failed to update exam" })
  }
})

// Delete exam (admin only)
router.delete("/:id", verifyFirebaseToken, checkAdmin, async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id)
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" })
    }
    res.json({ message: "Exam deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete exam" })
  }
})

export default router
