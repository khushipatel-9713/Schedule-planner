import express from 'express';
import { getHomeData } from '../controllers/homeController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getHomeData);

export default router;
