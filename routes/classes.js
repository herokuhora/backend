const express = require("express")
const router = express.Router()
const Class = require("../models/Class")
const { verifyToken, isAdmin } = require("../middleware/auth")

// Get all classes
router.get("/", verifyToken, async (req, res) => {
  try {
    const classes = await Class.find().sort({ createdAt: -1 })
    res.json(classes)
  } catch (error) {
    console.error("Fetch classes error:", error)
    res.status(500).json({ error: "Failed to fetch classes" })
  }
})

// Get single class
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
    if (!classData) {
      return res.status(404).json({ error: "Class not found" })
    }
    res.json(classData)
  } catch (error) {
    console.error("Fetch class error:", error)
    res.status(500).json({ error: "Failed to fetch class" })
  }
})

// Create class (admin only)
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const classData = new Class({
      ...req.body,
      createdBy: req.user.email,
    })

    await classData.save()
    res.status(201).json(classData)
  } catch (error) {
    console.error("Create class error:", error)
    res.status(500).json({ error: "Failed to create class" })
  }
})

// Delete class (admin only)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id)
    res.json({ message: "Class deleted successfully" })
  } catch (error) {
    console.error("Delete class error:", error)
    res.status(500).json({ error: "Failed to delete class" })
  }
})

module.exports = router
