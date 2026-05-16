export interface CalendarDay {
  date: string;
  categories: string[];
  total_workouts: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface HomeHeaderProps {
  dateStr: string;
  dayName: string;
  animKey?: number; // pass keyCal/keyWorkout from parent to re-animate on reload
}

export interface MacroItem {
  label: string;
  value: number;
  goal: number;
  unit: string;
  bg: string;
  track: string;
}

export interface CaloriesCardProps {
  currentCalories: number;
  caloriesGoal: number;
  caloriesRemaining: number;
  macros: MacroItem[];
}

export interface SubStat {
  label: string;
  value: string;
  unit: string;
  progress: number;
  color: string;
}

export interface WorkoutCardProps {
  date: string;
  totalWorkouts: number;
  durationMinutes: number;
  prCount: number;
  durationProgress: number;
  subStats: SubStat[];
  energyValue: number;
  energyProgress: number;
  moodValue: number;
  moodProgress: number;
}
