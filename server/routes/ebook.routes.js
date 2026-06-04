import { Router } from "express";
import {
  uploadEbook,
  getEbooks,
  getEbookBySlug,
  updateEbook,
  deleteEbook,
  incrementDownloadCount,
} from "../controllers/ebook.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";
import { uploadEbookFiles } from "../middlewares/upload.middleware.js";

const router = Router();

// Public
router.get("/", getEbooks);
router.get("/slug/:slug", getEbookBySlug);
router.post("/:id/download", incrementDownloadCount);

// Admin
router.post("/", isAdmin, uploadEbookFiles, uploadEbook);
router.put("/:id", isAdmin, uploadEbookFiles, updateEbook);
router.delete("/:id", isAdmin, deleteEbook);

export default router;
