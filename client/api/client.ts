import axios from "axios";
import { getToken } from "@/utils/token";

export const api = axios.create({
  baseURL: "http://192.168.2.146:8000/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
api.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

// Explicit control (OPTIONAL)
export const setAuthHeader = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Token ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};
