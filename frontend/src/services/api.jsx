import axios from "axios";

const api = axios.create({
  baseURL: "https://mediahubapi.up.railway.app/api",
  withCredentials: true,
  timeout: 15000,
});

// Interceptor para debug
api.interceptors.request.use((config) => {
  console.log('🔄 Fazendo request para:', config.url);
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('✅ Response success:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ Erro na API:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default api;