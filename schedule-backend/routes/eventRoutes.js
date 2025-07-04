import express from 'express';
import { createEvent, getAllEvents } from '../controllers/eventController.js';

const router = express.Router();

router.post('/add', createEvent);
router.get('/', getAllEvents);

export default router;
