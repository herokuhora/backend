import express from "express"
import { verifyFirebaseToken } from "../middleware/auth.middleware.js"
import Submission from "../models/Submission.model.js"
import Student from "../models/Student.model.js"
import Exam from "../models/Exam.model.js"

const router = express.Router()

// Submit exam answers
router.post("/", verifyFirebaseToken, async (req, res) => {
  try {
    const { examId, answers, timeTaken } = req.body

    // Get student
    const student = await Student.findOne({ firebaseUid: req.user.uid })
    if (!student) {
      return res.status(404).json({ error: "Student not found" })
    }

    // Get exam
    const exam = await Exam.findById(examId)
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" })
    }

    // Calculate score
    let score = 0
    let correctAnswers = 0
    const gradedAnswers = answers.map((answer, index) => {
      const question = exam.questions[index]
      let isCorrect = false
      let pointsEarned = 0

      if (question.questionType === "mcq") {
        const correctOption = question.options.find((opt) => opt.isCorrect)
        if (correctOption && answer.answer === correctOption.text) {
          isCorrect = true
          pointsEarned = question.points
          score += pointsEarned
          correctAnswers++
        }
      }

      return {
        questionId: question._id,
        answer: answer.answer,
        isCorrect,
        pointsEarned,
      }
    })

    const submission = new Submission({
      examId,
      studentId: student._id,
      examTitle: exam.title,
      answers: gradedAnswers,
      score,
      totalPoints: exam.totalPoints,
      correctAnswers,
      wrongAnswers: exam.questions.length - correctAnswers,
      timeTaken,
      isGraded: true,
    })

    await submission.save()
    res.status(201).json({ message: "Exam submitted successfully", submission })
  } catch (error) {
    console.error("Submission error:", error)
    res.status(500).json({ error: "Failed to submit exam", message: error.message })
  }
})

// Get student submissions
router.get("/my-submissions", verifyFirebaseToken, async (req, res) => {
  try {
    const student = await Student.findOne({ firebaseUid: req.user.uid })
    if (!student) {
      return res.status(404).json({ error: "Student not found" })
    }

    const submissions = await Submission.find({ studentId: student._id }).populate("examId").sort({ submittedAt: -1 })

    res.json(submissions)
  } catch (error) {
    console.error("Fetch submissions error:", error)
    res.status(500).json({ error: "Failed to fetch submissions" })
  }
})

// Get leaderboard
router.get("/leaderboard", verifyFirebaseToken, async (req, res) => {
  try {
    const { year } = req.query

    const submissions = await Submission.find({ isGraded: true })
      .populate({
        path: "studentId",
        match: year && year !== "all" ? { examYear: year } : {},
      })
      .sort({ correctAnswers: -1, timeTaken: 1 })
      .limit(100)

    // Filter out submissions where student is null (didn't match year filter)
    const filteredSubmissions = submissions.filter((sub) => sub.studentId !== null)

    res.json(filteredSubmissions)
  } catch (error) {
    console.error("Fetch leaderboard error:", error)
    res.status(500).json({ error: "Failed to fetch leaderboard" })
  }
})

// Get submission by ID
router.get("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id).populate("examId").populate("studentId")

    if (!submission) {
      return res.status(404).json({ error: "Submission not found" })
    }

    res.json(submission)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch submission" })
  }
})

export default router
