import axios from "axios";

const defaultApiUrl = import.meta.env.DEV
  ? "http://localhost:3000"
  : "https://dev-link-backend-opal.vercel.app";

export const API_URL = (
  import.meta.env.VITE_API_URL || defaultApiUrl
).replace(/\/$/, "");

export const SOCKET_URL = (
  import.meta.env.VITE_SOCKET_URL || API_URL
).replace(/\/$/, "");

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("devlink_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
