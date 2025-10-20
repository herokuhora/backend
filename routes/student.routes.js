import express from "express"
import { verifyFirebaseToken } from "../middleware/auth.middleware.js"
import Student from "../models/Student.model.js"

const router = express.Router()

// Register new student
router.post("/register", verifyFirebaseToken, async (req, res) => {
  try {
    const { firstName, lastName, school, examYear, phoneNumber, address } = req.body
    const { uid, email, picture } = req.user

    // Check if student already exists
    const existingStudent = await Student.findOne({ firebaseUid: uid })
    if (existingStudent) {
      return res.status(400).json({ error: "Student already registered" })
    }

    const student = new Student({
      firebaseUid: uid,
      email,
      firstName,
      lastName,
      school,
      examYear,
      profileImage: picture || null,
      phoneNumber,
      address,
    })

    await student.save()
    res.status(201).json({ message: "Student registered successfully", student })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ error: "Registration failed", message: error.message })
  }
})

// Get student profile
router.get("/profile", verifyFirebaseToken, async (req, res) => {
  try {
    const student = await Student.findOne({ firebaseUid: req.user.uid }).populate("enrolledClasses")

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

// Update student profile
router.put("/profile", verifyFirebaseToken, async (req, res) => {
  try {
    const { firstName, lastName, school, phoneNumber, address, profileImage } = req.body

    const student = await Student.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { firstName, lastName, school, phoneNumber, address, profileImage },
      { new: true, runValidators: true },
    )

    if (!student) {
      return res.status(404).json({ error: "Student not found" })
    }

    res.json({ message: "Profile updated successfully", student })
  } catch (error) {
    console.error("Profile update error:", error)
    res.status(500).json({ error: "Failed to update profile" })
  }
})

// Get student by ID
router.get("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
    if (!student) {
      return res.status(404).json({ error: "Student not found" })
    }
    res.json(student)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch student" })
  }
})

export default router
