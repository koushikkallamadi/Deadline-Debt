import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://deadline-debt.onrender.com/api",
});

// Attach the JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
