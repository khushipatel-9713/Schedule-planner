import express from "express";
import { addLog, getLogs } from "../controllers/trackerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addLog);      // Save a new time log
router.get("/", protect, getLogs);      // Get all logs of logged-in user

export default router;
