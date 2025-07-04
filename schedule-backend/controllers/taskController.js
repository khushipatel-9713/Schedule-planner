import Task from "../models/Task.js";
export const getTaskCount = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const count = await Task.countDocuments({ userId });
    res.status(200).json({ count });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Failed to get task count" ,err:err});
  }
};
