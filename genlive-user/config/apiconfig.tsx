// src/config/axiosClient.ts
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "/api/proxy", // ✅ Gọi qua Next.js API route
});

axiosClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
