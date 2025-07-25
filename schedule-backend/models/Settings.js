// models/Settings.js

import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  theme: {
    type: String,
    default: 'light',
  },
  notifications: {
    type: Boolean,
    default: true,
  },
  timeZone: {
    type: String,
    default: 'Asia/Kolkata',
  }
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
