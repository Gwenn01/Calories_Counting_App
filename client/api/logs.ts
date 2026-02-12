import { api } from "./client";

export const createLogs = async (data: any) => {
  const res = await api.post("/logs", data);
  return res.data;
};

export const getLogs = async () => {
  const res = await api.get("/logs");
  return res.data;
};
