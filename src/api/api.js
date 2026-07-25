import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? "http://127.0.0.1:8000/api/"
    : "https://resume-jd-matcher-backend2.onrender.com/api/");

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (
      token &&
      !config.url.includes("login") &&
      !config.url.includes("register")
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ❌ DO NOT touch Content-Type at all
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
