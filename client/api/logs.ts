import { api } from "./client";

export const createLogs = async (data: any) => {
  const res = await api.post("api/food-logs/", data);
  return res.data;
};

// get log by meal type
export const getLogsByMeal = async (date: string, mealType: string) => {
  const res = await api.get("/api/food-logs/", {
    params: {
      date: date,
      meal_type: mealType,
    },
  });

  return res.data;
};

/// remove logs
export const removeLogs = async (id: number) => {
  const res = await api.delete(`/api/food-logs/${id}/`);
};
