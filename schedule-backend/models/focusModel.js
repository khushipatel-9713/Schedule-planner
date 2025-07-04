import mongoose from 'mongoose';

const focusSessionSchema = new mongoose.Schema({
  task: { type: String, required: true },
  isWorkTime: { type: Boolean, default: true },
  duration: { type: Number, required: true }, // in seconds
  ambientSound: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const FocusSession = mongoose.model('FocusSession', focusSessionSchema);
export default FocusSession;
