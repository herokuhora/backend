const express = require("express")
const router = express.Router()
const ExamSubmission = require("../models/ExamSubmission")
const { verifyToken, isAdmin } = require("../middleware/auth")

// Get all submissions (admin only)
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const submissions = await ExamSubmission.find().populate("examId").sort({ submittedAt: -1 })
    res.json(submissions)
  } catch (error) {
    console.error("Fetch submissions error:", error)
    res.status(500).json({ error: "Failed to fetch submissions" })
  }
})

// Submit exam answers
router.post("/", verifyToken, async (req, res) => {
  try {
    const submission = new ExamSubmission(req.body)
    await submission.save()
    res.status(201).json(submission)
  } catch (error) {
    console.error("Submit exam error:", error)
    res.status(500).json({ error: "Failed to submit exam" })
  }
})

// Mark answer (admin only)
router.patch("/:id/mark", verifyToken, isAdmin, async (req, res) => {
  try {
    const { questionIdentifier, isCorrect } = req.body
    const submission = await ExamSubmission.findById(req.params.id)

    if (!submission) {
      return res.status(404).json({ error: "Submission not found" })
    }

    // Update the specific answer
    submission.answers = submission.answers.map((answer) => {
      if (answer.questionId === questionIdentifier || answer.questionIndex === questionIdentifier) {
        const points = answer.points || 10
        return {
          ...answer.toObject(),
          isCorrect,
          earnedPoints: isCorrect ? points : 0,
        }
      }
      return answer
    })

    // Recalculate total score
    submission.score = submission.answers.reduce((sum, ans) => sum + (ans.earnedPoints || 0), 0)

    await submission.save()
    res.json(submission)
  } catch (error) {
    console.error("Mark answer error:", error)
    res.status(500).json({ error: "Failed to mark answer" })
  }
})

module.exports = router
