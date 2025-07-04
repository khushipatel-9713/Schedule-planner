import express from 'express';
import {
  addGoal,
  getGoals,
  updateGoal,
  deleteGoal
} from '../controllers/goalController.js';
import { protect } from '../middleware/authMiddleware.js';
import { countCompletedGoals } from '../controllers/goalController.js';

const router = express.Router();

// ✅ Apply protect middleware to all goal routes
router.use(protect);

router.post('/', addGoal);
router.get('/get', getGoals);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);
router.get('/completed/count',  countCompletedGoals);

export default router;
