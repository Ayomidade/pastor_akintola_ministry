// src/services/ebook.service.js
import api from "../api/axios.js";
export const ebookService = {
  getAll: (params) => api.get("/ebooks", { params }),
  getBySlug: (slug) => api.get(`/ebooks/slug/${slug}`),
  upload: (data) => api.post("/ebooks", data),
  update: (id, data) => api.put(`/ebooks/${id}`, data),
  delete: (id) => api.delete(`/ebooks/${id}`),
  incrementDownload: (id) => api.post(`/ebooks/${id}/download`),
};
