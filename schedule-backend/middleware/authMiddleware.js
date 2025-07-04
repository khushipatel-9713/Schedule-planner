// 📁 middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    // 🧠 Optional logs based on route being accessed
    const url = req.originalUrl;
    if (url.includes("dashboard") || url.includes("/tasks/count") || url.includes("/goals/completed") || url.includes("/focus/today")) {
      console.log("📊 Dashboard accessed by:", req.user.email);
    }
    if (url.includes("goals")) {
      console.log("🎯 Goals accessed by:", req.user.email);
    }
    if (url.includes("reports")) {
      console.log("📈 Reports accessed by:", req.user.email);
    }

    next();
  } catch (err) {
    console.error("❌ Auth Middleware Error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
// ✅ Correct way to export named function
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token.' });
  }
};
