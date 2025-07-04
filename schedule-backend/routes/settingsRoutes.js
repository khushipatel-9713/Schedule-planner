// routes/settings.js

import express from 'express';
import Settings from '../models/Settings.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET user settings
router.get('/', protect, async (req, res) => {
  try {
    const settings = await Settings.findOne({ user: req.user._id });
    res.json(settings || {});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings' });
  }
});

// POST or update settings
router.post('/', protect, async (req, res) => {
  try {
    let settings = await Settings.findOne({ user: req.user._id });

    if (settings) {
      settings.set(req.body);
    } else {
      settings = new Settings({ ...req.body, user: req.user._id });
    }

    await settings.save();
    res.json({ message: 'Settings saved', settings });
  } catch (error) {
    res.status(500).json({ message: 'Error saving settings' });
  }
});

export default router;
