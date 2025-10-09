import axios from "axios";

const baseLocal = "http://localhost:3001/api";
const baseProd = "https://mediahubapi.up.railway.app/api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (window.location.hostname === "localhost" ? baseLocal : baseProd),
  withCredentials: true,
});

// Interceptor para adicionar automaticamente o token JWT, se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
