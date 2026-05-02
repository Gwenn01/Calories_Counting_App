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

// food bot apis
export const foodBot = async (foodPrompt: string) => {
  const res = await api.post("api/food-bot/", {
    food_prompt: foodPrompt,
  });
  return res.data;
};
// food bar code apis
export const foodBar = async (foodBarcode: string) => {
  const res = await api.post("api/food-bar-code/", {
    food_barcode: foodBarcode,
  });
  return res.data;
};

// food scan pic apis
