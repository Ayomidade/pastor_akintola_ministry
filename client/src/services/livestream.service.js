// src/services/livestream.service.js
import api from "../api/axios.js";
export const livestreamService = {
  getActive: () => api.get("/livestream/active"),
  set: (data) => api.post("/livestream", data),
  deactivate: (id) => api.patch(`/livestream/${id}/deactivate`),
};
