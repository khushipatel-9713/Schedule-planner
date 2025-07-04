import Notification from '../models/Notification.js';

// GET /api/notifications?userId=xyz
export const getNotifications = async (req, res) => {
const userId = req.user.id;
  try {
    const notifs = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// PUT /api/notifications/:id/toggle
  export const toggleReadStatus = async (req, res) => {
    const { id } = req.params;
    try {
      const notif = await Notification.findById(id);
      notif.read = !notif.read;
      await notif.save();
      res.json(notif);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update status' });
    }
  };

// PUT /api/notifications/mark-all-read
export const markAllRead = async (req, res) => {
const userId = req.user.id;
  try {
    await Notification.updateMany({ userId }, { $set: { read: true } });
    res.json({ message: 'All marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark all read' });
  }
};

// (Optional) POST /api/notifications
export const createNotification = async (req, res) => {
  const { userId, icon, type, title, message, time } = req.body;
  try {
    const notif = new Notification({ userId, icon, type, title, message, time });
    await notif.save();
    res.status(201).json(notif);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
};
