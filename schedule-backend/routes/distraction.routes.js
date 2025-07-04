import express from "express";
import { protect } from "../middleware/authMiddleware.js"; // ✅ path must match actual folder

const router = express.Router();

// Example protected route
router.get("/log", protect, (req, res) => {
  res.json({ message: "Distraction log access granted", user: req.user });
});

export default router;
