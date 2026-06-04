// src/services/chat.service.js
import api from "../api/axios.js";
export const chatService = {
  startSession: () => api.post("/chat/session"),
  getMySession: () => api.get("/chat/session/me"),
  getSessionMessages: (sessionId) =>
    api.get(`/chat/session/${sessionId}/messages`),
  getAllSessions: () => api.get("/chat/admin/sessions"),
  getAdminSessionMessages: (sessionId) =>
    api.get(`/chat/admin/sessions/${sessionId}/messages`),
  getUnreadCount: () => api.get("/chat/admin/unread"),
  closeSession: (sessionId) =>
    api.patch(`/chat/admin/sessions/${sessionId}/close`),
};
