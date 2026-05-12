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

// session log =================================================================
// services/workoutService.ts
export const createWorkoutSession = async (payload: {
  template: number;
  notes: string;
  energy_level: number;
  mood_rating: number;
}) => {
  const res = await api.post("api/workout/session/", payload);
  return res.data;
};

export const fetchAllWorkoutSession = async () => {
  const res = await api.get(`api/workout/session/`);
  return res.data;
};

export const fetchSessionsByDate = async (date: string) => {
  // date format: "2026-05-12"
  const res = await api.get(`api/workout/session/?date=${date}`);
  return res.data;
};

export const fetchWorkoutSession = async (id: number) => {
  const res = await api.get(`api/workout/session/${id}/`);
  return res.data;
};

export const finishWorkoutSession = async (id: number) => {
  const res = await api.put(`api/workout/session/${id}/`, {
    is_finished: true,
  });
  return res.data;
};

export const deleteWorkoutSession = async (id: number) => {
  const res = await api.delete(`api/workout/session/${id}/`);
  return res.data;
};

export const getExercisePerSession = async (exerciseId: number) => {
  const res = await api.get(`/workout/session/exercise/${exerciseId}/`);
  return res.data;
};

export const updateExercisePerSession = async (
  exerciseId: number,
  payload: any,
) => {
  // example payload: {
  //   "notes": "Focus on form",
  //   "is_favorite": true
  // }
  const res = await api.put(
    `api/workout/session/exercise/${exerciseId}/`,
    payload,
  );
  return res.data;
};

export const deleteExercisePerSession = async (exerciseId: number) => {
  const res = await api.delete(`api/workout/session/exercise/${exerciseId}/`);
  return res.data;
};

export const createExercisePerSession = async (
  exerciseId: number,
  payload: any,
) => {
  // example payload: {
  //     "exercise_id": 25,
  //     "sets": 3,
  //     "reps": 10,
  //     "weight": 60.0,
  //     "rest_target": 90,
  //     "notes": "Focus on squeeze at top"
  // }
  const res = await api.post(
    `api/workout/session/exercise-create/${exerciseId}/`,
    payload,
  );
  return res.data;
};

export const getSetPerExercise = async (setID: number) => {
  const res = await api.get(`api/workout/exercise/set/${setID}/`);
  return res.data;
};

export const updateSetPerExercise = async (setID: number, payload: any) => {
  // example payload: {
  //  {
  //     "weight": 100,
  //     "reps": 8,
  //     "rest_target": 90,
  //     "tempo": "3-1-2-0",
  //     "is_warmup": true,
  //     "is_dropset": false
  // }
  const res = await api.put(`api/workout/exercise/set/${setID}/`, payload);
  return res.data;
};

export const markSetAsCompleted = async (setID: number, payload: any) => {
  // example payload: {
  //   {
  //     "completed": true,
  //     "rpe": 7,
  //     "rest_taken": 90,
  //     "is_pr": true
  // }
  const res = await api.put(`api/workout/exercise/set/${setID}/`, payload);
  return res.data;
};

export const deleteSetPerExercise = async (setID: number) => {
  const res = await api.delete(`api/workout/exercise/set/${setID}/`);
  return res.data;
};

export const addSetPerExercise = async (exerciseID: number, payload: any) => {
  // example payload: {}
  const res = await api.post(
    `api/workout/exercise/set-create/${exerciseID}/`,
    payload,
  );
  return res.data;
};
