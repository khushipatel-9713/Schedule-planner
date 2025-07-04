import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import calendarRoutes from "./routes/calendar.routes.js";
import distractionRoutes from "./routes/distraction.routes.js";
import eventRoutes from './routes/eventRoutes.js';
import focusRoutes from './routes/focusRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
// import habitRoutes from "./routes/habitRoutes.js";
import notificationRoutes from './routes/notificationRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import smartSchedulerRoutes from './routes/smartSchedulerRoutes.js';
import trackerRoutes from "./routes/trackerRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
// import habitsRoutes from "./routes/habits.js";
import homeRoutes from './routes/home.js';
import router from "./routes/habitRoutes.js";
import routerFeed from "./routes/feedbackRoutes.js";
import reportRouter from "./routes/reportsRoutes.js";


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/reports",reportRouter)
app.use("/habits",router);
app.use("/api/auth", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/distractions", distractionRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/focus', focusRoutes);
app.use('/api/goals', goalRoutes);
// app.use("/api/habits", habitRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/smart-scheduler', smartSchedulerRoutes);
app.use("/api/tracker", trackerRoutes);
app.use("/api/tasks", taskRoutes);
// app.use("/api/habits", habitsRoutes);
app.use('/api/home', homeRoutes);

app.use('/feedback',routerFeed);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
