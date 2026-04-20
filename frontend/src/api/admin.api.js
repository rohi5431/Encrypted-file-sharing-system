import api from "./axios";

export const getAdminStats = () => api.get("/admin/stats");
export const getAdminUsers = () => api.get("/admin/users");
export const getAdminFiles = () => api.get("/admin/files");
