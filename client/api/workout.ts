import { api } from "./client";
import { FitnessProfile } from "@/types/workout";

// get the totals logs
export const createWorkoutProfile = async (data: FitnessProfile) => {
  const res = await api.post("api/workout/profile/", data);
  return res.data;
};

export const updateWorkoutProfile = async (data: FitnessProfile) => {
  const res = await api.put("api/workout/profile/", data);
  return res.data;
};

export const fetchWorkoutProfile = async () => {
  const res = await api.get("api/workout/profile/");
  return res.data;
};
