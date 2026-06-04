import { Router } from "express";
import {
  setupAdmin,
  login,
  logout,
  getMe,
  changePassword,
  requestPasswordResetOTP,
  resetPasswordWithOTP,
  checkSetupStatus,
} from "../controllers/auth.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";
import { rateLimit } from "express-rate-limit";

const router = Router();
export const  setupRouter=Router()

setupRouter.get("/", checkSetupStatus);

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many OTP requests. Please try again in 15 minutes.",
  },
});

// Public
// router.get("/setup-status", checkSetupStatus);
router.post("/setup", setupAdmin);
router.post("/login", login);
router.post("/forgot-password", otpLimiter, requestPasswordResetOTP);
router.post("/reset-password", resetPasswordWithOTP);

// Protected
router.post("/logout", isAdmin, logout);
router.get("/me", isAdmin, getMe);
router.put("/change-password", isAdmin, changePassword);

export default router;
