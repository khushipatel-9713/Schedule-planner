import FocusSession from '../models/focusModel.js';

// Save a focus session
export const saveFocusSession = async (req, res) => {
  try {
    const { task, isWorkTime, duration, ambientSound } = req.body;
    const session = new FocusSession({ task, isWorkTime, duration, ambientSound });
    await session.save();
    res.status(201).json({ message: "Focus session saved successfully", session });
  } catch (error) {
    res.status(500).json({ error: "Error saving focus session" ,error});
  }
};

// Get all focus sessions
export const getAllFocusSessions = async (req, res) => {
  try {
    const sessions = await FocusSession.find().sort({ timestamp: -1 });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching focus sessions" });
  }
};



export const countTodayFocusTime = async (req, res) => {
  try {
    const userId = req.user.id; // if sessions are user-specific (optional)

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const totalFocus = await FocusSession.aggregate([
      {
        $match: {
          timestamp: {
            $gte: startOfDay,
            $lte: endOfDay
          },
          // Optional if you add `userId` in schema
          // userId: mongoose.Types.ObjectId(userId)
        }
      },
      {
        $group: {
          _id: null,
          totalDuration: { $sum: "$duration" }
        }
      }
    ]);

    const duration = totalFocus.length > 0 ? totalFocus[0].totalDuration : 0;

    res.status(200).json({ todayFocusTimeInSeconds: duration });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to count today's focus time", error: err.message });
  }
};
