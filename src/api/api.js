import axios from "axios";

const api = axios.create({
  baseURL: "https://resume-jd-matcher-backend.onrender.com/api/",
});

export default api;
