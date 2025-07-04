import express from "express";
import { addFeedback ,getAllFeedbacks} from "../controllers/feedbackController.js";
import { protect } from "../middleware/authMiddleware.js";

const routerFeed = express.Router();

routerFeed.post("/", protect, addFeedback); // only logged-in users
routerFeed.get("/", getAllFeedbacks);
export default routerFeed;
