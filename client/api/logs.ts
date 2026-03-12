import { api } from "./client";

export const createLogs = async (data: any) => {
  const formattedDate = data.created_at.toISOString().split("T")[0];
  const payload = {
    ...data,
    created_at: formattedDate,
  };
  const res = await api.post("api/food-logs/", payload);
  return res.data;
};

// get log by meal type
export const getLogsByMeal = async (date: Date, mealType: string) => {
  const formattedDate = date.toISOString().split("T")[0];
  const res = await api.get("/api/food-logs/", {
    params: {
      date: formattedDate,
      meal_type: mealType,
    },
  });

  return res.data;
};

/// remove logs
export const removeLogs = async (id: number, date: Date) => {
  const formattedDate = date.toISOString().split("T")[0];
  await api.delete(`/api/food-logs/${id}/${formattedDate}/`);
};

// get the totals logs
export const getFoodLogsTotal = async (date: Date) => {
  const formattedDate = date.toISOString().split("T")[0];
  const res = await api.get(`/api/food-logs/${formattedDate}/totals/`);
  return res.data;
};
