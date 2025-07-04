import express from 'express';
import { saveFocusSession, getAllFocusSessions,countTodayFocusTime } from '../controllers/focusController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/save', saveFocusSession);
router.get('/', getAllFocusSessions);
router.get('/time/today', protect, countTodayFocusTime);
export default router;
