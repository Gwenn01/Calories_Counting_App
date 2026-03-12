import axios from "axios";
import { getToken, removeToken } from "@/utils/token";

export const api = axios.create({
  baseURL: "http://192.168.0.229:8000/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await removeToken();
    }

    return Promise.reject(error);
  },
);
