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

export type Exercise = {
  id: number;
  name: string;
  muscle_group: string;
  equipment: string;
  difficulty: string;
  exercise_type: string;
};

export type TemplateExercise = {
  id: number;
  exercise: {
    id: number;
    name: string;
    muscle_group: string;
    equipment: string;
  };
  order: number;
  default_sets: number;
  default_reps: number;
  default_weight: number;
  default_rest: number;
  notes: string;
};

export type WorkoutTemplate = {
  id: number;
  name: string;
  category: string;
  description: string;
  is_public: boolean;
  estimated_duration: number;
  template_exercises?: TemplateExercise[]; // ← make optional
  created_at?: string;
};

export interface WorkoutSet {
  id: number;
  set_number: number;
  weight: number;
  reps: number;
  completed: boolean;
  rpe: number | null;
  rest_taken: number | null;
  rest_target: number | null;
  is_warmup: boolean;
  is_dropset: boolean;
  is_pr: boolean;
  volume: number;
  estimated_1rm: number;
  completed_at: string | null;
}

export interface WorkoutExercise {
  id: number;
  exercise: Exercise;
  order: number;
  notes: string;
  is_favorite: boolean;
  superset_group: string;
  sets: WorkoutSet[];
  total_volume: number;
  best_set: WorkoutSet | null;
}

export interface WorkoutSession {
  id: number;
  date: string;
  category: string;
  template: number;
  start_time: string;
  end_time: string | null;
  duration_seconds: number | null;
  notes: string;
  energy_level: number;
  mood_rating: number;
  bodyweight: number;
  weight_unit: string;
  total_volume: number;
  total_sets_completed: number;
  total_reps: number;
  workout_exercises: WorkoutExercise[];
  is_finished: boolean;
}

export interface ExerciseCardProps {
  workoutExercise: WorkoutExercise;
  sessionId: number;
  onUpdate: () => void;
}

export interface ExerciseHeaderProps {
  workoutExercise: WorkoutExercise;
  completedCount: number;
  notes: string;
  showNotes: boolean;
  savingNotes: boolean;
  togglingFav: boolean;
  deletingExercise: boolean;
  onToggleNotes: () => void;
  onChangeNotes: (text: string) => void;
  onBlurNotes: () => void;
  onToggleFavorite: () => void;
  onDeleteExercise: () => void;
}

export interface SetRowProps {
  set: WorkoutSet;
  restTimer?: number;
  onComplete: (weight: number, reps: number, rpe: number | null) => void;
  onDelete: () => void;
}

export interface StatsRowProps {
  totalVolume: number;
  bestSet: { weight: number; reps: number } | null;
  est1rm: number | undefined;
}
