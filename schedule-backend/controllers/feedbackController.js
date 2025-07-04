import Feedback from "../models/feedbackModel.js";
import User from "../models/User.js";

export const addFeedback = async (req, res) => {
  const userId = req.user.id;

  try {
    const alreadyGiven = await Feedback.findOne({ userId });
    if (alreadyGiven) {
      return res.status(200).json({ message: "You have already submitted feedback." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { rating, message } = req.body;

    const feedback = new Feedback({
      userId,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic || "https://i.imgur.com/default-avatar.png",
      rating,
      message,
    });

    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully", feedback });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};