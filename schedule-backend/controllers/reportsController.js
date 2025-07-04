import Task from "../models/Task.js";

export const getWeeklyReport = async (req, res) => {
  try {
    const userId = req.user._id;

    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 6); // Last 7 days including today

    const tasks = await Task.find({
      userId,
      dueDate: { $gte: lastWeek, $lte: today }
    });

    // Initialize arrays and variables
    const focusPerDay = Array(7).fill(0); // index 0 = Sunday
    const categories = { Work: 0, Study: 0, Personal: 0 };
    let totalTime = 0, wastedTime = 0;

    tasks.forEach(task => {
      const day = new Date(task.dueDate).getDay(); // Sunday = 0
      const hrs = 1; // Assuming 1 hour per task (you can adjust if you add `duration` field later)
      focusPerDay[day] += hrs;

      // Infer category based on title or fallback logic
      if (task.title.toLowerCase().includes("work")) categories.Work += hrs;
      else if (task.title.toLowerCase().includes("study")) categories.Study += hrs;
      else categories.Personal += hrs;

      totalTime += hrs;
      if (!task.completed) wastedTime += hrs;
    });

    const orderedWeeklyData = [...focusPerDay.slice(1), focusPerDay[0]]; // reorder: Mon–Sun

    res.status(200).json({
      weeklyData: orderedWeeklyData,
      categoryData: [categories.Work, categories.Study, categories.Personal],
      timeData: [totalTime - wastedTime, wastedTime]
    });

  } catch (err) {
    console.error("Report generation error:", err);
    res.status(500).json({ message: "Error generating report", error: err.message });
  }
};
