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
app.use(cors({
  origin: 'https://schedule-planner-frontend.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use("/reports",reportRouter)
app.use("/habits",router);
app.use("/auth", authRoutes);
app.use("/calendar", calendarRoutes);
app.use("/distractions", distractionRoutes);
app.use('/events', eventRoutes);
app.use('/focus', focusRoutes);
app.use('/goals', goalRoutes);
app.use('/notifications', notificationRoutes);
app.use('/profile', profileRoutes);
app.use('/settings', settingsRoutes);
app.use('/smart-scheduler', smartSchedulerRoutes);
app.use("/tracker", trackerRoutes);
app.use("/tasks", taskRoutes);
app.use('/home', homeRoutes);

app.use('/feedback',routerFeed);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
