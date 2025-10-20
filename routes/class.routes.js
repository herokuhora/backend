import express from "express"
import { verifyFirebaseToken, checkAdmin } from "../middleware/auth.middleware.js"
import Class from "../models/Class.model.js"
import Student from "../models/Student.model.js"

const router = express.Router()

// Get all classes
router.get("/", verifyFirebaseToken, async (req, res) => {
  try {
    const classes = await Class.find({ isActive: true }).sort({ createdAt: -1 })
    res.json(classes)
  } catch (error) {
    console.error("Fetch classes error:", error)
    res.status(500).json({ error: "Failed to fetch classes" })
  }
})

// Get enrolled classes for student
router.get("/my-classes", verifyFirebaseToken, async (req, res) => {
  try {
    const student = await Student.findOne({ firebaseUid: req.user.uid }).populate("enrolledClasses")

    if (!student) {
      return res.status(404).json({ error: "Student not found" })
    }

    res.json(student.enrolledClasses)
  } catch (error) {
    console.error("Fetch enrolled classes error:", error)
    res.status(500).json({ error: "Failed to fetch enrolled classes" })
  }
})

// Get class by ID
router.get("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
    if (!classData) {
      return res.status(404).json({ error: "Class not found" })
    }
    res.json(classData)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch class" })
  }
})

// Enroll in class
router.post("/:id/enroll", verifyFirebaseToken, async (req, res) => {
  try {
    const student = await Student.findOne({ firebaseUid: req.user.uid })
    if (!student) {
      return res.status(404).json({ error: "Student not found" })
    }

    const classData = await Class.findById(req.params.id)
    if (!classData) {
      return res.status(404).json({ error: "Class not found" })
    }

    // Check if already enrolled
    if (student.enrolledClasses.includes(classData._id)) {
      return res.status(400).json({ error: "Already enrolled in this class" })
    }

    student.enrolledClasses.push(classData._id)
    classData.enrolledStudents.push(student._id)

    await student.save()
    await classData.save()

    res.json({ message: "Enrolled successfully" })
  } catch (error) {
    console.error("Enrollment error:", error)
    res.status(500).json({ error: "Failed to enroll" })
  }
})

// Create class (admin only)
router.post("/", verifyFirebaseToken, checkAdmin, async (req, res) => {
  try {
    const classData = new Class(req.body)
    await classData.save()
    res.status(201).json({ message: "Class created successfully", class: classData })
  } catch (error) {
    console.error("Create class error:", error)
    res.status(500).json({ error: "Failed to create class" })
  }
})

export default router
