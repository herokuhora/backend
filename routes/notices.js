const express = require("express")
const router = express.Router()
const Notice = require("../models/Notice")
const { verifyToken, isAdmin } = require("../middleware/auth")

// Get all notices
router.get("/", verifyToken, async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 }).limit(50)
    res.json(notices)
  } catch (error) {
    console.error("Fetch notices error:", error)
    res.status(500).json({ error: "Failed to fetch notices" })
  }
})

// Create notice (admin only)
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const notice = new Notice({
      ...req.body,
      createdBy: req.user.email,
    })

    await notice.save()
    res.status(201).json(notice)
  } catch (error) {
    console.error("Create notice error:", error)
    res.status(500).json({ error: "Failed to create notice" })
  }
})

// Delete notice (admin only)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id)
    res.json({ message: "Notice deleted successfully" })
  } catch (error) {
    console.error("Delete notice error:", error)
    res.status(500).json({ error: "Failed to delete notice" })
  }
})

module.exports = router
