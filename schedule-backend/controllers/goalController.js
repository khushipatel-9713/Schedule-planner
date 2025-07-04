import Goal from '../models/Goal.js';
import User from '../models/User.js';
import { sendNotificationEmail } from '../utils/sendNotificationEmail.js';
import Notification from '../models/Notification.js';

// @desc Add a new goal
export const addGoal = async (req, res) => {
  const { title, milestones } = req.body;
  const userId = req.user.id;

  try {
    const goal = await Goal.create({
      userId,
      title,
      milestones,
      checked: Array(milestones.length).fill(false)
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
            
            and the ${milestones}`
          );
        }

    res.status(201).json(goal);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating goal', error });
  }
};

// @desc Get all goals of a user
export const getGoals = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId)
    const goals = await Goal.find({ userId });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goals', error });
  }
};

// @desc Update milestone check status
export const updateGoal = async (req, res) => {
  const { id } = req.params;
  const { checked } = req.body;

  try {
    const goal = await Goal.findById(id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    if (goal.userId.toString() !== req.user._id.toString()){
      return res.status(401).json({ message: 'Unauthorized' });
    }

    goal.checked = checked;
    await goal.save();

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Error updating goal', error });
  }
};

// @desc Delete goal
export const deleteGoal = async (req, res) => {
  const { id } = req.params;

  try {
    const goal = await Goal.findById(id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    if (goal.userId.toString() !== req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await goal.remove();
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting goal', error });
  }
};
export const countCompletedGoals = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Goal.aggregate([
      {
        $match: {
          userId
        }
      },
      {
        $project: {
          milestonesCount: { $size: "$milestones" },
          checkedTrueCount: {
            $size: {
              $filter: {
                input: "$checked",
                as: "c",
                cond: { $eq: ["$$c", true] }
              }
            }
          }
        }
      },
      {
        $match: {
          $expr: { $eq: ["$milestonesCount", "$checkedTrueCount"] }
        }
      },
      {
        $count: "completedGoals"
      }
    ]);

    const completedGoals = result[0]?.completedGoals || 0;
    res.status(200).json({ completedGoals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to count completed goals", error: err.message });
  }
};