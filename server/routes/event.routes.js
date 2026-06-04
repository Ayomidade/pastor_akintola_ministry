import { Router } from "express";
import {
  createEvent,
  getEvents,
  getEventBySlug,
  updateEvent,
  deleteEvent,
  getAllEventsAdmin
} from "../controllers/event.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";
import { uploadImage } from "../middlewares/upload.middleware.js";

const router = Router();

// Public
router.get("/", getEvents);
router.get("/slug/:slug", getEventBySlug);

// Admin — static routes BEFORE dynamic ones
router.get("/admin", isAdmin, getAllEventsAdmin);
router.get("/slug/:slug", getEventBySlug);

// Admin mutations
router.post("/", isAdmin, uploadImage.single("image"), createEvent);
router.put("/:id", isAdmin, uploadImage.single("image"), updateEvent);
router.delete("/:id", isAdmin, deleteEvent);

export default router;
