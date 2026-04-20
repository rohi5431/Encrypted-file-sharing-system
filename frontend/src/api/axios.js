import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  withCredentials: true, // useful if you rely on cookies for auth
  headers: {
    Accept: "application/json",
  },
});

// Add Authorization header from localStorage token (if used)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response handling (logout on 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      // optionally redirect to login here (frontend route)
    }
    return Promise.reject(error);
  }
);

export default api;
