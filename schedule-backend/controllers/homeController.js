import db from '../config/db.js';

export const getHomeData = async (req, res) => {
  const userId = req.user.id;

  try {
    const [tasks] = await db.query('SELECT COUNT(*) AS totalTasksToday FROM tasks WHERE user_id = ? AND DATE(date) = CURDATE()', [userId]);
    const [habits] = await db.query('SELECT COUNT(*) AS completedHabits FROM habits WHERE user_id = ? AND status = "completed" AND DATE(updated_at) = CURDATE()', [userId]);
    const [focus] = await db.query('SELECT SUM(minutes) AS focusTime FROM focus_sessions WHERE user_id = ? AND DATE(date) = CURDATE()', [userId]);

    const quote = "Discipline is choosing between what you want now and what you want most.";

    res.json({
      message: `Welcome back, ${req.user.name.split(" ")[0]}!`,
      totalTasksToday: tasks[0].totalTasksToday || 0,
      completedHabits: habits[0].completedHabits || 0,
      focusTime: focus[0].focusTime || 0,
      quote
    });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong', details: err });
  }
};
