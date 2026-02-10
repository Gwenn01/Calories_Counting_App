import { api } from "./client";

export const generateBalancedMacros = (calories: number) => {
  return api.post("/macros/generate/", {
    calories,
  });
};
