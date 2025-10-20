import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import admin from "firebase-admin"

// Import routes
import studentRoutes from "./routes/student.routes.js"
import examRoutes from "./routes/exam.routes.js"
import submissionRoutes from "./routes/submission.routes.js"
import noticeRoutes from "./routes/notice.routes.js"
import classRoutes from "./routes/class.routes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Initialize Firebase Admin
try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  })
  console.log("Firebase Admin initialized successfully")
} catch (error) {
  console.error("Firebase Admin initialization error:", error.message)
}

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/students", studentRoutes)
app.use("/api/exams", examRoutes)
app.use("/api/submissions", submissionRoutes)
app.use("/api/notices", noticeRoutes)
app.use("/api/classes", classRoutes)

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Sapelaweddo API is running",
    timestamp: new Date().toISOString(),
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

export default app
