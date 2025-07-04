import express from "express";
// import {
//   getAllHabits,
//   createHabit,
//   updateHabit,
//   deleteHabit,
// } from "../controllers/habitsController.js";

import { getHabits ,createHabit ,updateHabit ,deleteHabit} from "../controllers/habitController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/",protect, getHabits);
router.post("/", protect,createHabit);
router.put("/:id",protect ,updateHabit);
router.delete("/:id",protect,deleteHabit);

export default router;
