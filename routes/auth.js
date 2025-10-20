const express = require("express")
const router = express.Router()
const Student = require("../models/Student")
const { verifyToken } = require("../middleware/auth")

// Register new student
router.post("/register", verifyToken, async (req, res) => {
  try {
    const firebaseUid = req.user.uid

    // Check if student already exists
    const existingStudent = await Student.findOne({ firebaseUid })
    if (existingStudent) {
      return res.status(400).json({ error: "Student already registered" })
    }

    // Generate unique student ID
    const examYear = req.body.examYear
    const yearSuffix = examYear.toString().slice(-2)
    let studentId
    let isUnique = false

    while (!isUnique) {
      const randomNum = Math.floor(1000 + Math.random() * 9000)
      studentId = `SW${yearSuffix}${randomNum}`
      const existing = await Student.findOne({ studentId })
      if (!existing) isUnique = true
    }

    // Create new student
    const student = new Student({
      ...req.body,
      firebaseUid,
      studentId,
      email: req.user.email,
    })

    await student.save()

    res.status(201).json({
      message: "Registration successful",
      studentId,
      student,
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ error: "Registration failed", message: error.message })
  }
})

// Get current user profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const student = await Student.findOne({ firebaseUid: req.user.uid })

    if (!student) {
      return res.status(404).json({ error: "Student not found" })
    }

    // Update last login
    student.lastLogin = new Date()
    await student.save()

    res.json(student)
  } catch (error) {
    console.error("Profile fetch error:", error)
    res.status(500).json({ error: "Failed to fetch profile" })
  }
})

// Check if user is registered
router.get("/check-registration", verifyToken, async (req, res) => {
  try {
    const student = await Student.findOne({ firebaseUid: req.user.uid })
    res.json({ isRegistered: !!student, student })
  } catch (error) {
    console.error("Check registration error:", error)
    res.status(500).json({ error: "Failed to check registration" })
  }
})

module.exports = router
