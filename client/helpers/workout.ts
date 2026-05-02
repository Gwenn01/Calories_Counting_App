import type { SetRow, Exercise } from "@/types/workout";

export const fmtTime = (s: number): string => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

export const newSet = (prevWeight = "", prevReps = ""): SetRow => ({
  id: Math.random().toString(36).slice(2),
  weight: prevWeight,
  reps: prevReps,
  done: false,
});

export const newExercise = (name: string): Exercise => ({
  id: Math.random().toString(36).slice(2),
  name,
  sets: [newSet()],
  notes: "",
  isFavorite: false,
});

export const calcTotalSets = (exercises: Exercise[]): number =>
  exercises.reduce((acc, ex) => acc + ex.sets.filter((s) => s.done).length, 0);

export const calcTotalVolume = (exercises: Exercise[]): number =>
  exercises.reduce(
    (acc, ex) =>
      acc +
      ex.sets
        .filter((s) => s.done)
        .reduce(
          (a, s) => a + (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0),
          0,
        ),
    0,
  );
