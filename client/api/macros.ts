import { api } from "./client";

export const generateBalancedMacros = (calories: number) => {
  return api.post("api/generate-macros/", {
    total_calories: calories,
  });
};

export const calculateDailyCalories = (payload: {
  age: number;
  height: number;
  weight: number;
  gender: string;
  activity_level: string;
  goal: string;
}) => {
  const data = api.post("api/calculate-daily-calories/", payload);
  return data;
};

export const fetchMacrosByDate = async () => {
  const res = await api.get("api/macros/");
  return res.data;
};
