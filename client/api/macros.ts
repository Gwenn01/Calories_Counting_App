import { api } from "./client";

export const generateBalancedMacros = (calories: number) => {
  return api.post("/macros/generate/", {
    calories,
  });
};

export const fetchMacrosByDate = async () => {
  const res = await api.get("api/macros/");
  return res.data;
};
