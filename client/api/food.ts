import { api } from "./client";

export const getAllFoods = async () => {
  const res = await api.get("api/foods/");
  return res.data;
};

export const createFood = async (food: any) => {
  const res = await api.post("api/foods/", food);
  return res.data;
};
