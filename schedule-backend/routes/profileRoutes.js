import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/',protect, getProfile);          // GET /api/profile/:id
router.put('/',protect, updateProfile);       // PUT /api/profile/:id

export default router;
