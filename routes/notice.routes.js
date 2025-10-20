import express from "express"
import { verifyFirebaseToken, checkAdmin } from "../middleware/auth.middleware.js"
import Notice from "../models/Notice.model.js"

const router = express.Router()

// Get all active notices
router.get("/", verifyFirebaseToken, async (req, res) => {
  try {
    const now = new Date()
    const notices = await Notice.find({
      isActive: true,
      $or: [{ expiresAt: { $gte: now } }, { expiresAt: null }],
    }).sort({ createdAt: -1 })

    res.json(notices)
  } catch (error) {
    console.error("Fetch notices error:", error)
    res.status(500).json({ error: "Failed to fetch notices" })
  }
})

// Create notice (admin only)
router.post("/", verifyFirebaseToken, checkAdmin, async (req, res) => {
  try {
    const notice = new Notice({
      ...req.body,
      createdBy: req.user.uid,
    })
    await notice.save()
    res.status(201).json({ message: "Notice created successfully", notice })
  } catch (error) {
    console.error("Create notice error:", error)
    res.status(500).json({ error: "Failed to create notice" })
  }
})

// Update notice (admin only)
router.put("/:id", verifyFirebaseToken, checkAdmin, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!notice) {
      return res.status(404).json({ error: "Notice not found" })
    }
    res.json({ message: "Notice updated successfully", notice })
  } catch (error) {
    res.status(500).json({ error: "Failed to update notice" })
  }
})

// Delete notice (admin only)
router.delete("/:id", verifyFirebaseToken, checkAdmin, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id)
    if (!notice) {
      return res.status(404).json({ error: "Notice not found" })
    }
    res.json({ message: "Notice deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete notice" })
  }
})

export default router
