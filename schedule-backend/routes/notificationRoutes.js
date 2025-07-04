import express from 'express';
import {
  getNotifications,
  toggleReadStatus,
  markAllRead,
  createNotification,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/',protect, getNotifications);
router.put('/:id/toggle',protect, toggleReadStatus);
router.put('/mark-all-read',protect, markAllRead);
router.post('/',protect, createNotification); // Optional

export default router;
