// src/services/newsletter.service.js
import api from "../api/axios.js";
export const newsletterService = {
  subscribe: (data) => api.post("/newsletter/subscribe", data),
  unsubscribe: (data) => api.post("/newsletter/unsubscribe", data),
  getAll: () => api.get("/newsletter"),
};
