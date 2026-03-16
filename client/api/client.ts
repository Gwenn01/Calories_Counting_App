import axios from "axios";
import { getToken, removeToken } from "@/utils/token";

export const api = axios.create({
  //baseURL: "https://caloriescountingappserverdeployment.onrender.com/",
  //baseURL: "http://192.168.1.34:8000/",
  baseURL: "http://192.168.1.38:8000/",
  //baseURL: "http://127.0.0.1:8000/",
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
