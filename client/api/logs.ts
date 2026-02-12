import { api } from "./client";

export const createLogs = async (data: any) => {
  const res = await api.post("api/food-logs/", data);
  return res.data;
};

export const getLogs = async (date: string) => {
  const res = await api.get(`api/food-logs/${date}/`);
  return res.data;
};
