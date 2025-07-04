import express from 'express';
import {
  generateSmartSchedule,
  getSmartSchedules,
  updateScheduleStatus,
} from '../controllers/smartSchedulerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getSmartSchedules);
router.post('/generate', protect, generateSmartSchedule);
router.put('/status/:id', protect, updateScheduleStatus);

export default router;
