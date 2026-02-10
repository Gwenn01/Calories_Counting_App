import { api } from "./client";

export const fetchTodayOverview = async () => {
  const response = await api.get("api/overview/");
  return response.data;
};
