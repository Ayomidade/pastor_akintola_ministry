import { Router } from "express";
import {
  subscribe,
  getSubscribers,
  unsubscribe,
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

// Public
router.post("/subscribe", subscribeLimiter, subscribe);
router.post("/unsubscribe", unsubscribe);

// Admin
router.get("/", isAdmin, getSubscribers);

export default router;
