import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});

export default api;
