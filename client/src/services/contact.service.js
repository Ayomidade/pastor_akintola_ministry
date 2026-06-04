// src/services/contact.service.js
import api from "../api/axios.js";
export const contactService = {
  submit: (data) => api.post("/contact", data),
  getAll: (params) => api.get("/contact", { params }),
  markRead: (id) => api.patch(`/contact/${id}/read`),
  delete: (id) => api.delete(`/contact/${id}`),
};
