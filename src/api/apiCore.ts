import axios from "axios";

const apiCore = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_CORE,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiCore;
