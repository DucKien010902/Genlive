// src/config/axiosClient.ts
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://apigenlive.nsland.vn", // ✅ Gọi thẳng domain backend
});

axiosClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
