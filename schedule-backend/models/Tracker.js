import mongoose from "mongoose";

const trackerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  task: { type: String, required: true },
  time: { type: String, required: true },
  seconds: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const Tracker = mongoose.model("Tracker", trackerSchema);
export default Tracker;
