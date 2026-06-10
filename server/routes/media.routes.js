// routes/media.routes.js
import { Router } from "express";
import {
  uploadMedia,
  getMedia,
  deleteMedia,
  deleteMultipleMedia,
  getCollections,
  getCollectionMedia,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../controllers/media.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";
import { uploadMultipleImages } from "../middlewares/upload.middleware.js";

const router = Router();

// Public
router.get("/collections", getCollections);
router.get("/collections/:collectionId/images", getCollectionMedia);
router.get("/collections/:slug", getCollectionBySlug);

// Multer error handler for file upload
const multerErrorHandler = (err, req, res, next) => {
  if (err && err.message) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// ------ Admin --- Collections
router.post("/collections", isAdmin, createCollection);
router.get("/collections/:id", isAdmin, updateCollection);
router.delete("/collections/:id", isAdmin, deleteCollection);

// Admin --- Images
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
