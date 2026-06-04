// src/services/visitor.service.js
import api from "../api/axios.js";
export const visitorService = {
  register: (data) => api.post("/visitors/register", data),
  login: (data) => api.post("/visitors/login", data),
  getMe: () => api.get("/visitors/me"),
};
