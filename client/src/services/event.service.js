// src/services/event.service.js
import api from "../api/axios.js";
export const eventService = {
  getAll: (params) => api.get("/events", { params }),
  getAllAdmin: () => api.get("/events/admin"),
  getBySlug: (slug) => api.get(`/events/slug/${slug}`),
  create: (data) => api.post("/events", data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
};
