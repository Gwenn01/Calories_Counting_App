import axios from "axios";
import { getToken } from "@/utils/token";

export const api = axios.create({
  baseURL: "http://192.168.2.146:8000/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token automatically
api.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
