import axios from "axios";

const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_AUTH,
  headers: {
    "Content-Type": "application/json",
  },
});

apiAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiAuth;