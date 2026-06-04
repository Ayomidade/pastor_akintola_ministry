import { Router } from "express";
import {
  submitContact,
  getContacts,
  markAsRead,
  deleteContact,
} from "../controllers/contact.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";
import { rateLimit } from "express-rate-limit";

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { message: "Too many submissions. Please try again later." },
});

// Public
router.post("/", contactLimiter, submitContact);

// Admin
router.get("/", isAdmin, getContacts);
router.patch("/:id/read", isAdmin, markAsRead);
router.delete("/:id", isAdmin, deleteContact);

export default router;
