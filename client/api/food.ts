import { api } from "./client";

export const getAllFoods = async () => {
  const res = await api.get("api/foods/");
  return res.data;
};

export const createFood = async (food: any) => {
  const res = await api.post("api/foods/", food);
  return res.data;
};

export const getOneFoods = async (id: number) => {
  const res = await api.get(`api/foods/${id}/`);
  return res.data;
};

export const updateFood = async (id: number, food: any) => {
  const res = await api.put(`api/foods/${id}/`, food);
  return res.data;
};

export const deleteFood = async (id: number) => {
  const res = await api.delete(`api/foods/${id}/`);
  return res.data;
};
