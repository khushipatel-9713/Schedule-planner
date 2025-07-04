import Tracker from "../models/Tracker.js";

export const addLog = async (req, res) => {
  const { task, time, seconds } = req.body;

  try {
    const newLog = await Tracker.create({
      user: req.user._id,
      task,
      time,
      seconds,
    });
    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).json({ message: "Failed to save log" });
  }
};

export const getLogs = async (req, res) => {
  try {
    const logs = await Tracker.find({ user: req.user._id }).sort({ date: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};
