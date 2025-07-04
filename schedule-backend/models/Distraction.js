  import mongoose from "mongoose";

  const distractionSchema = new mongoose.Schema({
    type: { type: String, required: true },
    time: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  }, { timestamps: true });

  export default mongoose.model("Distraction", distractionSchema);
