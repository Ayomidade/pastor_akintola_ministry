import { Router } from "express";
import {
  startSession,
  getMySession,
  getAllSessions,
  getSessionMessages,
  closeSession,
  getUnreadCount,
} from "../controllers/chat.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";
import { isVisitor } from "../middlewares/visitorAuth.middleware.js";

const router = Router();

// Visitor — protected by JWT
router.post("/session", isVisitor, startSession);
router.get("/session/me", isVisitor, getMySession);
router.get("/session/:sessionId/messages", isVisitor, getSessionMessages);

// Admin — protected by session
router.get("/admin/sessions", isAdmin, getAllSessions);
router.get("/admin/sessions/:sessionId/messages", isAdmin, getSessionMessages);
router.get("/admin/unread", isAdmin, getUnreadCount);
router.patch("/admin/sessions/:sessionId/close", isAdmin, closeSession);

export default router;
