import { useState, useCallback, useMemo, memo } from "react";
import { View, Vibration } from "react-native";
import {
  markSetAsCompleted,
  addSetPerExercise,
  deleteSetPerExercise,
  updateWorkoutExercise,
  deleteWorkoutExercise,
} from "@/api/workout";
import type { WorkoutSet } from "@/types/workout";
import type { ExerciseCardProps } from "@/types/workout";
import ExerciseHeader from "@/components/Workout/SessionExerciseCardContainer/ExerciseHeader";
import SetRow from "@/components/Workout/SessionExerciseCardContainer/SetRow";
import StatsRow from "@/components/Workout/SessionExerciseCardContainer/StatsRow";
import AddSetButton from "@/components/Workout/SessionExerciseCardContainer/AddSetButton";
import { useAlert } from "../AlertProvider";
import { useToast } from "../ToastProvider";

// ─── Memoized SetRow wrapper ────────────────────────────────────────────────
// Extracted so useCallback can be used per-set without being inside .map()
const MemoSetRow = memo(function MemoSetRow({
  set,
  weightUnit,
  restTimer,
  onComplete,
  onDelete,
}: {
  set: WorkoutSet;
  weightUnit: string;
  restTimer?: number;
  onComplete: (
    weight: number,
    reps: number,
    rpe: number | null,
    restTarget: number,
  ) => void;
  onDelete: () => void;
}) {
  return (
    <SetRow
      weightUnit={weightUnit}
      set={set}
      restTimer={restTimer}
      onComplete={onComplete}
      onDelete={onDelete}
    />
  );
});

// ─── SetRow container: stable callbacks per set ──────────────────────────────
const SetRowContainer = memo(function SetRowContainer({
  set,
  weightUnit,
  restTimer,
  onCompleteSet,
  onDeleteSet,
}: {
  set: WorkoutSet;
  weightUnit: string;
  restTimer?: number;
  onCompleteSet: (
    set: WorkoutSet,
    weight: number,
    reps: number,
    rpe: number | null,
    restTarget: number,
  ) => void;
  onDeleteSet: (setId: number) => void;
}) {
  const handleComplete = useCallback(
    (weight: number, reps: number, rpe: number | null, restTarget: number) =>
      onCompleteSet(set, weight, reps, rpe, restTarget),
    [set, onCompleteSet],
  );

  const handleDelete = useCallback(
    () => onDeleteSet(set.id),
    [set.id, onDeleteSet],
  );

  return (
    <MemoSetRow
      set={set}
      weightUnit={weightUnit}
      restTimer={restTimer}
      onComplete={handleComplete}
      onDelete={handleDelete}
    />
  );
});

// ─── Main ExerciseCard ───────────────────────────────────────────────────────
function ExerciseCard({
  weightUnit,
  workoutExercise,
  onUpdate,
}: ExerciseCardProps) {
  const { showAlert } = useAlert();
  const { showToast } = useToast();

  const [restTimers, setRestTimers] = useState<Record<number, number>>({});
  const [addingSet, setAddingSet] = useState(false);
  const [showNotes, setShowNotes] = useState(!!workoutExercise.notes);
  const [notes, setNotes] = useState(workoutExercise.notes ?? "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [togglingFav, setTogglingFav] = useState(false);
  const [deletingExercise, setDeletingExercise] = useState(false);

  // ── Derived stats (memoized) ─────────────────────────────────────────────
  const completedCount = useMemo(
    () => workoutExercise.sets.filter((s) => s.completed).length,
    [workoutExercise.sets],
  );

  const totalVolume = useMemo(
    () =>
      workoutExercise.sets
        .filter((s) => s.completed)
        .reduce((acc, s) => acc + (s.volume ?? 0), 0),
    [workoutExercise.sets],
  );

  const est1rm = useMemo(
    () =>
      workoutExercise.sets
        .filter((s) => s.completed && s.estimated_1rm)
        .sort((a, b) => (b.estimated_1rm ?? 0) - (a.estimated_1rm ?? 0))[0]
        ?.estimated_1rm,
    [workoutExercise.sets],
  );

  const bestSet = workoutExercise.best_set;

  // ── Rest timer ───────────────────────────────────────────────────────────
  const playRestDoneSound = useCallback(() => {
    Vibration.vibrate([0, 1000, 200, 1000, 200, 4000]);
  }, []);

  const startRestTimer = useCallback(
    (setId: number, targetSeconds: number) => {
      setRestTimers((prev) => ({ ...prev, [setId]: targetSeconds }));

      const interval = setInterval(() => {
        setRestTimers((prev) => {
          const next = (prev[setId] ?? 0) - 1;
          if (next <= 0) {
            clearInterval(interval);
            playRestDoneSound();
            const { [setId]: _, ...rest } = prev;
            return rest;
          }
          return { ...prev, [setId]: next };
        });
      }, 1000);
    },
    [playRestDoneSound],
  );

  // ── Handlers (all stable via useCallback) ────────────────────────────────
  const handleCompleteSet = useCallback(
    async (
      set: WorkoutSet,
      weight: number,
      reps: number,
      rpe: number | null,
      restTarget: number,
    ) => {
      try {
        await markSetAsCompleted(set.id, {
          weight,
          reps,
          completed: true,
          rpe,
          rest_taken: restTarget,
        });
        startRestTimer(set.id, restTarget);
        onUpdate();
        showToast("Set Completed", "Great job!", "success");
      } catch (e) {
        console.error(e);
      }
    },
    [startRestTimer, onUpdate, showToast],
  );

  const handleDeleteSet = useCallback(
    async (setId: number) => {
      try {
        await deleteSetPerExercise(setId);
        onUpdate();
      } catch (e) {
        console.error(e);
      }
    },
    [onUpdate],
  );

  const handleAddSet = useCallback(async () => {
    try {
      setAddingSet(true);
      await addSetPerExercise(workoutExercise.id, {});
      onUpdate();
    } catch (e) {
      console.error(e);
    } finally {
      setAddingSet(false);
    }
  }, [workoutExercise.id, onUpdate]);

  const handleToggleFavorite = useCallback(async () => {
    try {
      setTogglingFav(true);
      await updateWorkoutExercise(workoutExercise.id, {
        is_favorite: !workoutExercise.is_favorite,
      });
      onUpdate();
    } catch (e) {
      console.error(e);
    } finally {
      setTogglingFav(false);
    }
  }, [workoutExercise.id, workoutExercise.is_favorite, onUpdate]);

  const handleSaveNotes = useCallback(async () => {
    try {
      setSavingNotes(true);
      await updateWorkoutExercise(workoutExercise.id, { notes });
      onUpdate();
    } catch (e) {
      console.error(e);
    } finally {
      setSavingNotes(false);
    }
  }, [workoutExercise.id, notes, onUpdate]);

  const handleDeleteExercise = useCallback(() => {
    showAlert("Remove Exercise", `Remove "${workoutExercise.exercise.name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            setDeletingExercise(true);
            await deleteWorkoutExercise(workoutExercise.id);
            showToast(
              "Removed!",
              `${workoutExercise.exercise.name} removed`,
              "success",
            );
            onUpdate();
          } catch (e) {
            showToast("Error", "Failed to remove exercise", "error");
          } finally {
            setDeletingExercise(false);
          }
        },
      },
    ]);
  }, [
    showAlert,
    showToast,
    workoutExercise.id,
    workoutExercise.exercise.name,
    onUpdate,
  ]);

  const handleToggleNotes = useCallback(() => setShowNotes((v) => !v), []);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <View className="bg-white border border-slate-300 rounded-[20px] overflow-hidden mx-4 mb-6">
      <ExerciseHeader
        workoutExercise={workoutExercise}
        completedCount={completedCount}
        notes={notes}
        showNotes={showNotes}
        savingNotes={savingNotes}
        togglingFav={togglingFav}
        deletingExercise={deletingExercise}
        onToggleNotes={handleToggleNotes}
        onChangeNotes={setNotes}
        onBlurNotes={handleSaveNotes}
        onToggleFavorite={handleToggleFavorite}
        onDeleteExercise={handleDeleteExercise}
      />

      {workoutExercise.sets.map((set) => (
        <SetRowContainer
          key={set.id}
          set={set}
          weightUnit={weightUnit}
          restTimer={restTimers[set.id]}
          onCompleteSet={handleCompleteSet}
          onDeleteSet={handleDeleteSet}
        />
      ))}

      {completedCount > 0 && (
        <StatsRow totalVolume={totalVolume} bestSet={bestSet} est1rm={est1rm} />
      )}

      <AddSetButton onPress={handleAddSet} addingSet={addingSet} />
    </View>
  );
}

export default memo(ExerciseCard);
