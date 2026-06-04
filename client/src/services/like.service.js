// src/services/like.service.js
import api from "../api/axios.js";
export const likeService = {
  like: (postId) => api.post(`/likes/${postId}`),
};
