import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
});

// inject token from sessionStorage (tab‑scoped) into headers
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token") || "";
  if (config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// on 401, clear sessionStorage and redirect
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      sessionStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
