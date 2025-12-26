import axios from "axios";

const api = axios.create({
  baseURL: "https://resume-jd-matcher-backend.onrender.com/api/",
});

// ✅ Attach token correctly
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (
    token &&
    !config.url.includes("login") &&
    !config.url.includes("register")
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 🔥 IMPORTANT: DO NOT force Content-Type
  // Axios will auto-set it for JSON or FormData
  delete config.headers["Content-Type"];

  return config;
});

export default api;
