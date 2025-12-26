import axios from "axios";

const api = axios.create({
  baseURL: "https://resume-jd-matcher-backend.onrender.com/api/",
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // attach token for ALL protected endpoints
    if (token && !config.url.includes("login") && !config.url.includes("register")) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 🚫 DO NOT set Content-Type manually
    delete config.headers["Content-Type"];

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
