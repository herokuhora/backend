const express = require("express")
const router = express.Router()
const Paper = require("../models/Paper")
const { verifyToken, isAdmin } = require("../middleware/auth")

// Get all papers
router.get("/", verifyToken, async (req, res) => {
  try {
    const { year } = req.query

    const query = {}
    if (year && year !== "all") {
      query.targetYear = year
    }

    const papers = await Paper.find(query).sort({ createdAt: -1 })
    res.json(papers)
  } catch (error) {
    console.error("Fetch papers error:", error)
    res.status(500).json({ error: "Failed to fetch papers" })
  }
})

// Create paper (admin only)
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const paper = new Paper({
      ...req.body,
      createdBy: req.user.email,
    })

    await paper.save()
    res.status(201).json(paper)
  } catch (error) {
    console.error("Create paper error:", error)
    res.status(500).json({ error: "Failed to create paper" })
  }
})

// Delete paper (admin only)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await Paper.findByIdAndDelete(req.params.id)
    res.json({ message: "Paper deleted successfully" })
  } catch (error) {
    console.error("Delete paper error:", error)
    res.status(500).json({ error: "Failed to delete paper" })
  }
})

module.exports = router
