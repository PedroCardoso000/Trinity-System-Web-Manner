import axios from "axios";

const apiCore = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_CORE,
  headers: {
    "Content-Type": "application/json",
  },
});

apiCore.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiCore;
