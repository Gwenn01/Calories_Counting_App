import { api } from "./client";
import { RegisterPayload } from "@/types/auth";

export const registerUser = (data: RegisterPayload) => {
  return api.post("/profile/", data);
};

export const loginUser = (data: { username: string; password: string }) => {
  return api.post("/login/", data);
};
