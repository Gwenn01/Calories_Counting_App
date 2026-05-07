import { api } from "./client";
import {
  FitnessProfile,
  WorkoutTemplate,
  TemplateExercise,
} from "@/types/workout";

// get the totals logs
export const createWorkoutProfile = async (data: FitnessProfile) => {
  const res = await api.post("api/workout/profile/", data);
  return res.data;
};

export const updateWorkoutProfile = async (data: FitnessProfile) => {
  const res = await api.put("api/workout/profile-edit/", data);
  return res.data;
};

export const fetchWorkoutProfile = async () => {
  const res = await api.get("api/workout/profile/");
  return res.data;
};

// Exercise ==================================================================
export const fetchExercisesByProgram = async (program: string) => {
  const res = await api.get(`api/workout/exercise-program/${program}/`);
  return res.data;
};

// workout template =================================================================
export const createWorkoutTemplate = async (data: WorkoutTemplate) => {
  const res = await api.post("api/workout/template/", data);
  return res.data;
};

export const fetchWorkoutTemplate = async () => {
  const res = await api.get("api/workout/template/");
  return res.data;
};

export const editWorkoutTemplate = async (
  id: number,
  data: TemplateExercise,
) => {
  const res = await api.put(`api/workout/template/${id}/`, data);
  return res.data;
};

export const deleteWorkoutTemplate = async (id: number) => {
  const res = await api.delete(`api/workout/template/${id}/`);
  return res.data;
};

// template exercise =================================================================
export const createTemplateExercise = async (data: TemplateExercise) => {
  const res = await api.post("api/workout/exercise-template/", data);
  return res.data;
};

export const editTemplateExercise = async (
  id: number,
  data: TemplateExercise,
) => {
  const res = await api.put(`api/workout/exercise-template/${id}/`, data);
  return res.data;
};

export const deleteTemplateExercise = async (id: number) => {
  const res = await api.delete(`api/workout/exercise-template/${id}/`);
  return res.data;
};
