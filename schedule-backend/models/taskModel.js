import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  category: { type: String, enum: ["Work", "Study", "Personal"], required: true },
  date: { type: Date, required: true },
  duration: { type: Number, default: 1 }, // in hours
  status: { type: String, enum: ["Completed", "Missed"], default: "Completed" }
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);

export default Task;
