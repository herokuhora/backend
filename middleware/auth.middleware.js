import admin from "firebase-admin"

export const verifyFirebaseToken = async (req, res, next) => {
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

export const checkAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    // Check if user has admin role in custom claims
    if (req.user.admin === true) {
      next()
    } else {
      return res.status(403).json({ error: "Admin access required" })
    }
  } catch (error) {
    console.error("Admin check error:", error)
    return res.status(403).json({ error: "Access denied" })
  }
}
