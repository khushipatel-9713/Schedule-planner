import Habit from "../models/Habit.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { sendNotificationEmail } from "../utils/sendNotificationEmail.js";



// @desc    Get all habits of logged-in user
export const getHabits = async (req, res) => {
  const habits = await Habit.find({ user: req.user._id }).sort("-createdAt");
  res.json(habits);
};

// @desc    Add new habit
export const createHabit = async (req, res) => {
  const { title, streak, fusion } = req.body;
   const userId = req.user.id;
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const newHabit = await Habit.create({
    user: req.user._id,
    title,
    streak: streak || 0,
    fusion: fusion || false,
  });
 const notif = new Notification({
          userId,
          icon: "🎯",
          type: "Goal",
          title: "New Goal Added",
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
            `Goal "${title}" has been added to your schedule.
            
            `
          );
        }

  res.status(201).json(newHabit);
};

// @desc    Update existing habit
export const updateHabit = async (req, res) => {
  const habit = await Habit.findById(req.params.id);

  if (!habit) return res.status(404).json({ message: "Habit not found" });
  if (habit.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  habit.title = req.body.title || habit.title;
  habit.streak = req.body.streak ?? habit.streak;
  habit.fusion = req.body.fusion ?? habit.fusion;

  const updatedHabit = await habit.save();
  res.json(updatedHabit);
};

// @desc    Delete habit
export const deleteHabit = async (req, res) => {
  const habit = await Habit.findById(req.params.id);

  if (!habit) return res.status(404).json({ message: "Habit not found" });
  if (habit.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await habit.deleteOne();
  res.json({ message: "Habit deleted" });
};
