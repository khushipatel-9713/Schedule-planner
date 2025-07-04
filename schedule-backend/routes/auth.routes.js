import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyOtp
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify",verifyOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
