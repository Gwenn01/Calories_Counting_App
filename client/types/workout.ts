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
