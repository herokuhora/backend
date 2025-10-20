const express = require("express")
const router = express.Router()
const Student = require("../models/Student")
const { verifyToken, isAdmin } = require("../middleware/auth")

// Get all students (admin only)
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const { year } = req.query

    const query = {}
    if (year && year !== "all") {
      query.examYear = year
    }

    const students = await Student.find(query).sort({ createdAt: -1 })
    res.json(students)
  } catch (error) {
    console.error("Fetch students error:", error)
    res.status(500).json({ error: "Failed to fetch students" })
  }
})

// Get student statistics (admin only)
router.get("/statistics", verifyToken, isAdmin, async (req, res) => {
  try {
    const { year } = req.query

    const query = {}
    if (year && year !== "all") {
      query.examYear = year
    }

    const totalStudents = await Student.countDocuments(query)
    const loggedInStudents = await Student.countDocuments({ ...query, lastLogin: { $ne: null } })

    // Daily login count
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const dailyLogins = await Student.countDocuments({
      ...query,
      lastLogin: { $gte: today, $lt: tomorrow },
    })

    res.json({
      totalStudents,
      loggedInStudents,
      dailyLogins,
    })
  } catch (error) {
    console.error("Statistics error:", error)
    res.status(500).json({ error: "Failed to fetch statistics" })
  }
})

module.exports = router
