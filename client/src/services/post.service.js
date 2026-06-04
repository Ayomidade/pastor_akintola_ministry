// src/services/post.service.js
import api from "../api/axios.js";
export const postService = {
  getAll: (params) => api.get("/posts", { params }),
  getBySlug: (slug) => api.get(`/posts/slug/${slug}`),
  getById: (id) => api.get(`/posts/admin/${id}`),
  create: (data) => api.post("/posts", data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
  togglePublish: (id) => api.patch(`/posts/${id}/publish`),
};
