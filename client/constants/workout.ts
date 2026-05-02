import type { WorkoutType } from "@/types/workout";

export const DEFAULT_REST = 90; // seconds

export const WORKOUT_TYPES: WorkoutType[] = [
  "Push",
  "Pull",
  "Legs",
  "Full Body",
  "Cardio",
  "Custom",
];

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
