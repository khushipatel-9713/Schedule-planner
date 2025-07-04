import express from "express";
import { getWeeklyReport } from "../controllers/reportsController.js";
import { protect } from "../middleware/authMiddleware.js";

const reportRouter = express.Router();

reportRouter.get("/weekly",protect, getWeeklyReport);

export default reportRouter;
