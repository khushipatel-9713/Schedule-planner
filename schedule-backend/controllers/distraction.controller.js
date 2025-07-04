import Distraction from "../models/Distraction.js";

// GET all logs for the logged-in user
export const getDistractions = async (req, res) => {
  try {
    const logs = await Distraction.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch distractions." });
  }
};

// POST a new distraction log
export const addDistraction = async (req, res) => {
  const { type, time } = req.body;
  try {
    const newLog = new Distraction({ type, time, user: req.user._id });
    await newLog.save();
    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).json({ message: "Failed to add distraction." });
  }
};

// DELETE all distractions of current user
export const clearDistractions = async (req, res) => {
  try {
    await Distraction.deleteMany({ user: req.user._id });
    res.json({ message: "All distractions cleared." });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear distractions." });
  }
};
