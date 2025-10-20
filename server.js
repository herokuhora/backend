const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const admin = require("firebase-admin")

dotenv.config()

const app = express()

// Middleware
app.use(
  cors({
    origin: ["https://v0-lmss-apela-weddomain-sr.vercel.app", "http://localhost:3000"],
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Initialize Firebase Admin SDK
const serviceAccount = {
  type: "service_account",
  project_id: "sapelaweddo-liveexam",
  private_key_id: "2ca595794514f0ad9319ab37c28f231e2560e024",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCsufymfGQE6sxw\nNINPlfND3mBQYb89GJLacqkSnn3YlsEqkIh8hKaOqfBWDOVTUgyCbd6eLVGncfRy\nWPs+7SpLi+kODLnNz0F2/ekQm+BJ9XufBFF3IbKlRbhNC8pVYkTUh3qkTukqHGlO\n5XpdwjqWmB6lbdlN58TOAgqWj4lYa8QXL2wlU3LtGfZNkunobWWLOWHdu5PbMlsi\nUlW4VXRCIZy8n6KSahnNv/X1lPYpHDGO3a+TwhTZoVTdPDKrhVZY7VvPluWgwkBw\ntvnwYqRq8g4qCG2tFJs37igyydxJokbUfVxI3ApvQZz904Mr9tYHWeY11vnTb6fu\nNgKojUaRAgMBAAECggEAErJXLNZOJVIdKxAkHptGp9QMbOcHwl9ElizPLFrHmIhJ\nBIh8na3mMY8nmsjukeRRwlSOQmT5b7ygDzieiaM2btMIOSMbgbGrjmvRrKCS2K6f\n4QigoNqe8dDoMD7UegWXGcJIfjykdJB6vbWNV1TM7rwspQ+M9CfgX8RMzRtgbJeg\nGyrQUmhRldJSd3WZk8RVnNVTDyULPsqck4vrS6ZtlfMrOEi8X+zSjRIgBHgEvMsn\nOXhnmO6Czx62IKgm4uVcNRQf5I3XSX9+/r5kPIAXnJtlnnL465SRM7xJL75wen7e\nimivy23s2W7zQnKkDpzzL8KKIjjXiBm7KX+7dvJyGQKBgQDemu4EELmhJ5ivcsjY\nXf0MQznTHFSSpQadIDFUuDas+rVOB7IS65QOOcOshuqjUXkmb7p/K3/9PZPbjWa9\nAJqCnCq/WsOeQGUeqBqf1KYil0vpiSJGaZjh9DpgJ8PtxXlN4V6fLaM1j1LnEXHu\nsD+Rt2xKE8s/wgsuOaEuE9XIVwKBgQDGo3waKTgrMIq4m7UHUKGFe0epu0ONquF/\nkofSLOC8lWpjgzOwrvLTSVVhzjjStGuKjs2yan3cgz4AcZncVTz+O1dA/OHdFqVu\no9MGNdnzL7TJQx/FTdKXsVpAt2MsC/E3jOC78oayZhxMpMnaTVgTtraeDd/ILhJw\nyJ0F/tC3VwKBgDzxQXRPd+KMyppN3HqP0LVIuk33lZfIIjVmGNtOy3kz8er45GGV\nqSTz34QeM6KerYI+WFp0eEfGUfJrldLslWBojLNyj9eFXam08AUN3KXfseKvrniE\ndFx31nt4p4Uy6PDPYG5HukTxhgrIld541g54nubw4FYGM7VmBaBtwbtlAoGBAKhv\ncIhuc2aMHtUzk2nEgXJCex394OZ8BAK9Kdaan2bJ/BCt7GLhtp5bDL+GssBYpOg0\n909W5arazvRpX+JplPKvNumwhYWH8nfDCum1OD7yMQaImKQhvXVLuhAucTWkWsKT\n/uzgVj9oPo7vHQqzkwAEaw3TDfMcvh5Mvnma/Ti5AoGALHAI03ldig57m/AgGDUZ\nM4UnYrxVAXlg3QOoz04imDdf5pNEf6gTv8KD/tBf6q78Wd7tR1VFRUV6nmpIVzkq\nsMCSjNHq/laUbQN/8TQsTE4GEyjmalpxhauZbmpbKbwxVNwTbcMpMB3U8VTfRnQd\n31zSuF4IeS/NvOy23FKOty8=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@sapelaweddo-liveexam.iam.gserviceaccount.com",
  client_id: "118047614303303319429",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40sapelaweddo-liveexam.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb+srv://codexsldev:06w0OnS9vQGtv76d@sapelaweddo.w9lxpvw.mongodb.net/?retryWrites=true&w=majority&appName=SapelaWeddo"

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully")
    console.log("Database:", mongoose.connection.name)
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message)
    console.error("Please check your MONGODB_URI environment variable")
    // Don't exit the process, let Render restart it
  })

// Handle MongoDB connection events
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected. Attempting to reconnect...")
})

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message)
})

// Import Routes
const authRoutes = require("./routes/auth")
const studentRoutes = require("./routes/students")
const noticeRoutes = require("./routes/notices")
const classRoutes = require("./routes/classes")
const examRoutes = require("./routes/exams")
const paperRoutes = require("./routes/papers")
const submissionRoutes = require("./routes/submissions")
const worktimeRoutes = require("./routes/worktime")

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/students", studentRoutes)
app.use("/api/notices", noticeRoutes)
app.use("/api/classes", classRoutes)
app.use("/api/exams", examRoutes)
app.use("/api/papers", paperRoutes)
app.use("/api/submissions", submissionRoutes)
app.use("/api/worktime", worktimeRoutes)

// Health Check
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Sapelaweddo LMS API is running",
    version: "1.0.0",
  })
})

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Sapelaweddo LMS API is running",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  })
})

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app
