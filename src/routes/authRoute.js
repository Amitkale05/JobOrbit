import { Router } from "express";
import {
  signupController,
  verifyOtpController,
  resendOtpController,
  loginController,
  getCurrentUserController,
  getUserByIdController,
  logoutController,
  forgotPasswordController,
  resetPasswordController,
} from "../controller/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const authRoute = Router();

// ── Public Routes ──────────────────────────────
authRoute.post("/signup", signupController);
authRoute.post("/verify-otp", verifyOtpController);
authRoute.post("/resend-otp", resendOtpController);
authRoute.post("/login", loginController);
authRoute.post("/forgot-password", forgotPasswordController);
authRoute.post("/reset-password", resetPasswordController);

// ── Protected Routes ───────────────────────────
authRoute.get("/current-user", protect, getCurrentUserController);
authRoute.post("/logout", protect, logoutController);
authRoute.get("/:id", protect, getUserByIdController);

export default authRoute;
