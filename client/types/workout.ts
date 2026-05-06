export type WorkoutType =
  | "Push"
  | "Pull"
  | "Legs"
  | "Full Body"
  | "Cardio"
  | "Custom";

export type ScreenState = "empty" | "active" | "rest" | "summary";

export interface SetRow {
  id: string;
  weight: string;
  reps: string;
  done: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  sets: SetRow[];
  notes: string;
  isFavorite: boolean;
}

export interface FitnessProfile {
  id?: number;
  weight_unit: "kg" | "lbs";
  default_rest_time: number; // seconds
  experience_level: "beginner" | "intermediate" | "advanced";
  progression_type: "linear" | "double" | "percentage" | "rpe";
  progression_increment_kg: number;
  progression_increment_lbs: number;
  updated_at?: string;
}
