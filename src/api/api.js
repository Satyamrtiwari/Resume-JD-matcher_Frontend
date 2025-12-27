import axios from "axios";

const api = axios.create({
  baseURL: "https://resume-jd-matcher-backend-1.onrender.com/api/",
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
