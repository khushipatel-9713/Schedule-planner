import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  milestones: {
    type: [String],
    required: true,
  },
  checked: {
    type: [Boolean],
    default: [],
  }
}, { timestamps: true });

export default mongoose.model('Goal', goalSchema);
