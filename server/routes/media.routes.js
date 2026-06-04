// routes/media.routes.js
import { Router } from "express";
import {
  uploadMedia,
  getMedia,
  deleteMedia,
  deleteMultipleMedia,
} from "../controllers/media.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";
import { uploadMultipleImages } from "../middlewares/upload.middleware.js";

const router = Router();

// Public
router.get("/", getMedia);

// Multer error handler for file upload
const multerErrorHandler = (err, req, res, next) => {
  if (err && err.message) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// Admin
router.post(
  "/",
  isAdmin,
  uploadMultipleImages.any(),
  multerErrorHandler,
  uploadMedia,
);
router.delete("/bulk", isAdmin, deleteMultipleMedia);
router.delete("/:id", isAdmin, deleteMedia);

export default router;
