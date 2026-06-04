// src/services/media.service.js
import api from "../api/axios.js";
export const mediaService = {
  getAll: (params) => api.get("/media", { params }),
  upload: (data) => api.post("/media", data),
  delete: (id) => api.delete(`/media/${id}`),
  deleteBulk: (ids) => api.delete("/media/bulk", { data: { ids } }),
};
