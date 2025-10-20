const admin = require("firebase-admin")

// Middleware to verify Firebase ID token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1]

    if (!token) {
      return res.status(401).json({ error: "No token provided" })
    }

    const decodedToken = await admin.auth().verifyIdToken(token)
    req.user = decodedToken
    next()
  } catch (error) {
    console.error("Token verification error:", error)
    return res.status(401).json({ error: "Invalid token" })
  }
}

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const Student = require("../models/Student")
    const student = await Student.findOne({ firebaseUid: req.user.uid })

    if (!student || student.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin only." })
    }

    req.student = student
    next()
  } catch (error) {
    console.error("Admin check error:", error)
    return res.status(500).json({ error: "Server error" })
  }
}

module.exports = { verifyToken, isAdmin }
