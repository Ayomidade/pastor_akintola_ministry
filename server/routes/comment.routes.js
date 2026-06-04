import { Router } from "express";
import {
  addComment,
  getComments,
  getAllCommentsAdmin,
  approveComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";
import { rateLimit } from "express-rate-limit";

const router = Router();

const commentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many comments submitted. Please slow down." },
});

// Public
router.get("/:postId", getComments);
router.post("/:postId", commentLimiter, addComment);

// Admin
router.get("/admin/all", isAdmin, getAllCommentsAdmin);
router.patch("/admin/:id/approve", isAdmin, approveComment);
router.delete("/admin/:id", isAdmin, deleteComment);

export default router;
