import { Router } from "express";
import { likePost } from "../controllers/like.controller.js";
import { rateLimit } from "express-rate-limit";

const router = Router();

const likeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { message: "Too many like requests." },
});

// Public
router.post("/:postId", likeLimiter, likePost);

export default router;
