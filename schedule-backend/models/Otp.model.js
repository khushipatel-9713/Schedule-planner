
import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  data: {
    name: String,
    email: String,
    password: String,
  },
});

export default mongoose.model('Otp', otpSchema);