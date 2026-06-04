// src/services/sermon.service.js
import api from "../api/axios.js";
export const sermonService = {
  getAll: (params) => api.get("/sermons", { params }),
  getBySlug: (slug) => api.get(`/sermons/slug/${slug}`),
  create: (data) => api.post("/sermons", data),
  update: (id, data) => api.put(`/sermons/${id}`, data),
  delete: (id) => api.delete(`/sermons/${id}`),
  togglePublish: (id) => api.patch(`/sermons/${id}/publish`),
  incrementListen: (id) => api.post(`/sermons/${id}/listen`),
  incrementDownload: (id) => api.post(`/sermons/${id}/download`),
};
