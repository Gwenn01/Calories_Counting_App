import { api } from "./client";

export const fetchCalendarOverview = async (year: number, month: number) => {
  const response = await api.get(`api/calendar/${year}/${month}/`);
  return response.data;
};

export const fetchTodayOverview = async () => {
  const response = await api.get("api/overview/");
  return response.data;
};

export const fetchWorkoutOverview = async () => {
  const response = await api.get("api/calculate-workout-overview/");
  return response.data;
};
