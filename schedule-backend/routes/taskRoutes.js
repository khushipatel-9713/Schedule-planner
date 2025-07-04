import express from "express";
import Task from "../models/Task.js";
import { getTaskCount } from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js"
import { sendNotificationEmail } from "../utils/sendNotificationEmail.js";
const router = express.Router();

// ------------------- Protected Dashboard Route -------------------
router.get("/count", protect, getTaskCount);

// ------------------- CRUD: GET all tasks -------------------
router.get("/",protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.find({userId}).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ------------------- Create new task -------------------
router.post("/",protect ,async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, dueDate, priority, completed } = req.body;
    const task = new Task({ userId,title, description, dueDate, priority, completed });
    const savedTask = await task.save();

         const notif = new Notification({
      userId,
      icon: "📅",
      type: "task",
      title: "New Task Added",
      message: `Task "${title}" has been created.`,
      time: new Date().toLocaleString(),
    });
    await notif.save();

    // 3. Send email to user
    const user = await User.findById(userId);
    if (user && user.email) {
      await sendNotificationEmail(
        user.email,
        "🆕 New Task Created",
        `Task "${title}" has been added to your schedule.`
      );
    }
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ------------------- Update task by ID -------------------
router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ------------------- Delete task by ID -------------------
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
