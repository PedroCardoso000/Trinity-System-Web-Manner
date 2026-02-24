import axios from "axios";

const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_AUTH,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiAuth;