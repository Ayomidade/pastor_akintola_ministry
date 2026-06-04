import { Router } from "express";
import {
  createSermon,
  getSermons,
  getSermonBySlug,
  updateSermon,
  deleteSermon,
  togglePublish,
  incrementListenCount,
  incrementDownloadCount,
} from "../controllers/sermon.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";
import { uploadSermonFiles } from "../middlewares/upload.middleware.js";

const router = Router();

// Public
router.get("/", getSermons);
router.get("/slug/:slug", getSermonBySlug);
router.post("/:id/listen", incrementListenCount);
router.post("/:id/download", incrementDownloadCount);

// Admin
router.post("/", isAdmin, uploadSermonFiles, createSermon);
router.put("/:id", isAdmin, uploadSermonFiles, updateSermon);
router.delete("/:id", isAdmin, deleteSermon);
router.patch("/:id/publish", isAdmin, togglePublish);

export default router;
