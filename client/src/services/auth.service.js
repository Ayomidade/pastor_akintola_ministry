import api from "../api/axios.js";
export const authService = {
  checkSetup: () => api.get("/auth/setup-status"),
  setup: (data) => api.post("/auth/setup", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
  changePassword: (data) => api.put("/auth/change-password", data),
  forgotPassword: (data) => api.post("/auth/forgot-password", data),
  resetPassword: (data) => api.post("/auth/reset-password", data),
};
