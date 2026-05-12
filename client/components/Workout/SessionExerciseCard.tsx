import { useState } from "react";
import { View, Text, Pressable, ActivityIndicator, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
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

export default function ExerciseCard({
  workoutExercise,
  onUpdate,
}: ExerciseCardProps) {
  const [restTimers, setRestTimers] = useState<Record<number, number>>({});
  const [addingSet, setAddingSet] = useState(false);
  const [showNotes, setShowNotes] = useState(!!workoutExercise.notes);
  const [notes, setNotes] = useState(workoutExercise.notes ?? "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [togglingFav, setTogglingFav] = useState(false);
  const [deletingExercise, setDeletingExercise] = useState(false);

  const completedCount = workoutExercise.sets.filter((s) => s.completed).length;
  const totalVolume = workoutExercise.sets
    .filter((s) => s.completed)
    .reduce((acc, s) => acc + (s.volume ?? 0), 0);
  const bestSet = workoutExercise.best_set;
  const est1rm = workoutExercise.sets
    .filter((s) => s.completed && s.estimated_1rm)
    .sort(
      (a, b) => (b.estimated_1rm ?? 0) - (a.estimated_1rm ?? 0),
    )[0]?.estimated_1rm;

  const startRestTimer = (setId: number, targetSeconds: number) => {
    setRestTimers((prev) => ({ ...prev, [setId]: targetSeconds }));
    const interval = setInterval(() => {
      setRestTimers((prev) => {
        const next = (prev[setId] ?? 0) - 1;
        if (next <= 0) {
          clearInterval(interval);
          const { [setId]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [setId]: next };
      });
    }, 1000);
  };

  const handleCompleteSet = async (
    set: WorkoutSet,
    weight: number,
    reps: number,
    rpe: number | null,
    restTarget: number, // ← add this
  ) => {
    try {
      await markSetAsCompleted(set.id, {
        weight,
        reps,
        completed: true,
        rpe,
        rest_taken: restTarget, // ← use passed value
      });
      startRestTimer(set.id, restTarget); // ← use passed value
      onUpdate();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSet = async () => {
    try {
      setAddingSet(true);
      await addSetPerExercise(workoutExercise.id, {});
      onUpdate();
    } catch (e) {
      console.error(e);
    } finally {
      setAddingSet(false);
    }
  };

  const handleDeleteSet = async (setId: number) => {
    try {
      await deleteSetPerExercise(setId);
      onUpdate();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleFavorite = async () => {
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
  };

  const handleSaveNotes = async () => {
    try {
      setSavingNotes(true);
      await updateWorkoutExercise(workoutExercise.id, { notes });
      onUpdate();
    } catch (e) {
      console.error(e);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDeleteExercise = () => {
    Alert.alert(
      "Remove Exercise",
      `Remove "${workoutExercise.exercise.name}" from this session?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingExercise(true);
              await deleteWorkoutExercise(workoutExercise.id);
              onUpdate();
            } catch (e) {
              console.error(e);
            } finally {
              setDeletingExercise(false);
            }
          },
        },
      ],
    );
  };

  return (
    <View className="bg-white border border-slate-100 rounded-[20px] overflow-hidden mx-4">
      <ExerciseHeader
        workoutExercise={workoutExercise}
        completedCount={completedCount}
        notes={notes}
        showNotes={showNotes}
        savingNotes={savingNotes}
        togglingFav={togglingFav}
        deletingExercise={deletingExercise}
        onToggleNotes={() => setShowNotes((v) => !v)}
        onChangeNotes={setNotes}
        onBlurNotes={handleSaveNotes}
        onToggleFavorite={handleToggleFavorite}
        onDeleteExercise={handleDeleteExercise}
      />

      {/* ── Sets ── */}
      <View className="px-4 py-3 gap-2.5">
        {workoutExercise.sets.map((set) => (
          <SetRow
            key={set.id}
            set={set}
            restTimer={restTimers[set.id]}
            onComplete={(weight, reps, rpe, restTarget) =>
              handleCompleteSet(set, weight, reps, rpe, restTarget)
            }
            onDelete={() => handleDeleteSet(set.id)}
          />
        ))}
      </View>

      {/* ── Stats ── */}
      {completedCount > 0 && (
        <StatsRow totalVolume={totalVolume} bestSet={bestSet} est1rm={est1rm} />
      )}

      {/* ── Add set ── */}
      <Pressable
        onPress={handleAddSet}
        disabled={addingSet}
        className="mx-3 mb-3 flex-row items-center justify-center gap-2 border border-dashed border-slate-200 rounded-[12px] py-2.5"
      >
        {addingSet ? (
          <ActivityIndicator size="small" color="#94a3b8" />
        ) : (
          <View className="flex-row items-center gap-2">
            <Feather name="plus" size={13} color="#94a3b8" />
            <Text className="text-xs font-bold text-slate-400">Add set</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}
