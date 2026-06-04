// src/services/comment.service.js
import api from "../api/axios.js";
export const commentService = {
  getByPost: (postId) => api.get(`/comments/${postId}`),
  getAllAdmin: () => api.get("/comments/admin/all"),
  add: (postId, data) => api.post(`/comments/${postId}`, data),
  approve: (id) => api.patch(`/comments/admin/${id}/approve`),
  delete: (id) => api.delete(`/comments/admin/${id}`),
};
