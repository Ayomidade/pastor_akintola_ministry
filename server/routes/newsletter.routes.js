import { Router } from "express";
import {
  subscribe,
  getSubscribers,
  unsubscribe,
  sendBulkEmail,
} from "../controllers/newsletter.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";
import { rateLimit } from "express-rate-limit";

const router = Router();

const subscribeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many subscription attempts. Please try again later.",
  },
});

const bulkEmailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    message: "Too many email sends. Please wait before sending again.",
  },
});

// Public
router.post("/subscribe", subscribeLimiter, subscribe);
router.post("/unsubscribe", unsubscribe);

// Admin
router.get("/", isAdmin, getSubscribers);
router.post("/send", isAdmin, bulkEmailLimiter, sendBulkEmail);

export default router;
