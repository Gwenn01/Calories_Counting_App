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
