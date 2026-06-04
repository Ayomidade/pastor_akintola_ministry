import { Router } from "express";
import {
  createPost,
  getPosts,
  getPostBySlug,
  getPostById,
  updatePost,
  deletePost,
  togglePublish,
} from "../controllers/post.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";
import { uploadImage } from "../middlewares/upload.middleware.js";

const router = Router();

// Public
router.get("/", getPosts);
router.get("/slug/:slug", getPostBySlug);

// Admin
router.get("/admin/:id", isAdmin, getPostById);
router.post("/", isAdmin, uploadImage.single("image"), createPost);
router.put("/:id", isAdmin, uploadImage.single("image"), updatePost);
router.delete("/:id", isAdmin, deletePost);
router.patch("/:id/publish", isAdmin, togglePublish);

export default router;
