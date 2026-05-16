import type { WorkoutType } from "@/types/workout";

export const DEFAULT_REST = 90; // seconds

export const WORKOUT_TYPES: WorkoutType[] = [
  "Push",
  "Pull",
  "Legs",
  "Upper",
  "Lower",
  "Anterior",
  "Posterior",
  "Full Body",
  "Cardio",
  "Custom",
];

// session states
export const MUSCLE_COLORS: Record<string, string> = {
  chest: "#f97316",
  back: "#3b82f6",
  legs: "#8b5cf6",
  anterior: "#10b981",
  posterior: "#06b6d4",
  shoulders: "#10b981",
  biceps: "#f59e0b",
  triceps: "#ef4444",
  core: "#06b6d4",
};

export const CATEGORY_META: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  push: { color: "#f97316", bg: "#fff7ed", border: "#ffedd5" },
  pull: { color: "#3b82f6", bg: "#eff6ff", border: "#dbeafe" },
  legs: { color: "#10b981", bg: "#f0fdf4", border: "#dcfce7" },
  upper: { color: "#8b5cf6", bg: "#f5f3ff", border: "#ede9fe" },
  lower: { color: "#ec4899", bg: "#fdf2f8", border: "#fce7f3" },
  full_body: { color: "#f59e0b", bg: "#fffbeb", border: "#fef3c7" },
  cardio: { color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
  anterior: { color: "#13dc35e", bg: "#f0fdf4", border: "#bbf3d0" },
  posterior: { color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe" },
};

export const EXERCISE_LIBRARY: { name: string; muscle: string }[] = [
  { name: "Bench Press", muscle: "Chest" },
  { name: "Incline Dumbbell Press", muscle: "Chest" },
  { name: "Push-Up", muscle: "Chest" },
  { name: "Cable Fly", muscle: "Chest" },
  { name: "Pull-Up", muscle: "Back" },
  { name: "Bent-Over Row", muscle: "Back" },
  { name: "Lat Pulldown", muscle: "Back" },
  { name: "Seated Cable Row", muscle: "Back" },
  { name: "Deadlift", muscle: "Back" },
  { name: "Barbell Squat", muscle: "Legs" },
  { name: "Romanian Deadlift", muscle: "Legs" },
  { name: "Leg Press", muscle: "Legs" },
  { name: "Lunges", muscle: "Legs" },
  { name: "Overhead Press", muscle: "Shoulders" },
  { name: "Lateral Raise", muscle: "Shoulders" },
  { name: "Barbell Curl", muscle: "Biceps" },
  { name: "Tricep Pushdown", muscle: "Triceps" },
  { name: "Plank", muscle: "Core" },
];
