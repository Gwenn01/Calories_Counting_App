import { api } from "./client";

export const getStreak = async () => {
  const res = await api.get("/api/history/streaks/");
  return res.data;
};
