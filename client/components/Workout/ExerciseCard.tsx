import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  markSetAsCompleted,
  addSetPerExercise,
  deleteSetPerExercise,
} from "@/api/workout";
import type { WorkoutExercise, WorkoutSet } from "@/types/workout";

interface Props {
  workoutExercise: WorkoutExercise;
  sessionId: number;
  onUpdate: () => void;
}

export default function ExerciseCard({ workoutExercise, onUpdate }: Props) {
  const [restTimers, setRestTimers] = useState<Record<number, number>>({});
  const [addingSet, setAddingSet] = useState(false);

  const startRestTimer = (setId: number, targetSeconds: number) => {
    setRestTimers((prev) => ({ ...prev, [setId]: targetSeconds }));
    const interval = setInterval(() => {
      setRestTimers((prev) => {
        const next = (prev[setId] ?? 0) - 1;
        if (next <= 0) {
          clearInterval(interval);
          return { ...prev, [setId]: 0 };
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
  ) => {
    try {
      await markSetAsCompleted(set.id, {
        weight,
        reps,
        completed: true,
        rpe,
        rest_taken: set.rest_target ?? 90,
      });
      startRestTimer(set.id, set.rest_target ?? 90);
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

  return (
    <View className="bg-white border border-slate-100 rounded-[20px] overflow-hidden">
      {/* Exercise header */}
      <View className="bg-slate-900 px-4 py-4 flex-row items-center gap-3">
        <View className="w-9 h-9 rounded-[10px] bg-orange-500 items-center justify-center">
          <Feather name="zap" size={15} color="#fff" />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-black text-white" numberOfLines={1}>
            {workoutExercise.exercise.name}
          </Text>
          <Text className="text-[11px] text-slate-400 capitalize">
            {workoutExercise.exercise.muscle_group} ·{" "}
            {workoutExercise.exercise.equipment}
          </Text>
        </View>
        {workoutExercise.is_favorite && (
          <Feather name="star" size={14} color="#f97316" />
        )}
      </View>

      {/* Column headers */}
      <View className="flex-row items-center px-4 py-2 bg-slate-50 border-b border-slate-100">
        <Text className="w-8 text-[10px] font-bold text-slate-400 text-center">
          SET
        </Text>
        <Text className="flex-1 text-[10px] font-bold text-slate-400 text-center">
          KG
        </Text>
        <Text className="flex-1 text-[10px] font-bold text-slate-400 text-center">
          REPS
        </Text>
        <Text className="flex-1 text-[10px] font-bold text-slate-400 text-center">
          RPE
        </Text>
        <Text className="w-16 text-[10px] font-bold text-slate-400 text-center">
          DONE
        </Text>
      </View>

      {/* Sets */}
      <View className="px-3 py-2 gap-1.5">
        {workoutExercise.sets.map((set) => (
          <SetRow
            key={set.id}
            set={set}
            restTimer={restTimers[set.id]}
            onComplete={(weight, reps, rpe) =>
              handleCompleteSet(set, weight, reps, rpe)
            }
            onDelete={() => handleDeleteSet(set.id)}
          />
        ))}
      </View>

      {/* Add set */}
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
            <Text className="text-xs font-bold text-slate-400">Add Set</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

// ── Set Row ──────────────────────────────────────────────────────────────────

interface SetRowProps {
  set: WorkoutSet;
  restTimer?: number;
  onComplete: (weight: number, reps: number, rpe: number | null) => void;
  onDelete: () => void;
}

function SetRow({ set, restTimer, onComplete, onDelete }: SetRowProps) {
  const [weight, setWeight] = useState(String(set.weight ?? ""));
  const [reps, setReps] = useState(String(set.reps ?? ""));
  const [rpe, setRpe] = useState(set.rpe ? String(set.rpe) : "");

  const pad = (n: number) => String(n).padStart(2, "0");

  // ── Completed + rest timer running ──
  if (set.completed && restTimer !== undefined && restTimer > 0) {
    return (
      <View className="flex-row items-center bg-emerald-50 border border-emerald-100 rounded-[12px] px-3 py-2.5 gap-2">
        <View className="w-8 items-center">
          <Text className="text-xs font-black text-emerald-600">
            {set.set_number}
          </Text>
        </View>
        <Feather name="check-circle" size={14} color="#10b981" />
        <Text className="flex-1 text-xs font-bold text-emerald-700">
          {set.weight}kg × {set.reps} reps
          {set.rpe ? ` · RPE ${set.rpe}` : ""}
        </Text>
        <View className="flex-row items-center gap-1 bg-emerald-100 rounded-full px-2 py-0.5">
          <Feather name="clock" size={10} color="#059669" />
          <Text className="text-xs font-black text-emerald-700">
            {pad(Math.floor(restTimer / 60))}:{pad(restTimer % 60)}
          </Text>
        </View>
      </View>
    );
  }

  // ── Completed ──
  if (set.completed) {
    return (
      <View className="flex-row items-center bg-slate-50 rounded-[12px] px-3 py-2.5 gap-2">
        <View className="w-8 items-center">
          <Text className="text-xs font-black text-slate-400">
            {set.set_number}
          </Text>
        </View>
        <Feather name="check" size={13} color="#10b981" />
        <Text className="flex-1 text-xs text-slate-500">
          {set.weight}kg × {set.reps} reps
          {set.rpe ? ` · RPE ${set.rpe}` : ""}
        </Text>
        {set.is_pr && (
          <View className="bg-yellow-50 border border-yellow-200 rounded-full px-2 py-0.5">
            <Text className="text-[9px] font-black text-yellow-600">PR 🏆</Text>
          </View>
        )}
        {set.is_warmup && (
          <View className="bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5">
            <Text className="text-[9px] font-bold text-blue-400">WARM</Text>
          </View>
        )}
      </View>
    );
  }

  // ── Active / pending ──
  return (
    <View className="flex-row items-center gap-1.5 py-1">
      {/* Set number */}
      <View className="w-8 items-center">
        <Text className="text-xs font-black text-slate-500">
          {set.set_number}
        </Text>
      </View>

      {/* Weight */}
      <View className="flex-1 bg-slate-50 border border-slate-200 rounded-[10px] px-1 py-2">
        <TextInput
          value={weight}
          onChangeText={setWeight}
          keyboardType="decimal-pad"
          className="text-sm font-bold text-slate-800 text-center"
          selectTextOnFocus
        />
      </View>

      {/* Reps */}
      <View className="flex-1 bg-slate-50 border border-slate-200 rounded-[10px] px-1 py-2">
        <TextInput
          value={reps}
          onChangeText={setReps}
          keyboardType="number-pad"
          className="text-sm font-bold text-slate-800 text-center"
          selectTextOnFocus
        />
      </View>

      {/* RPE */}
      <View className="flex-1 bg-slate-50 border border-slate-200 rounded-[10px] px-1 py-2">
        <TextInput
          value={rpe}
          onChangeText={setRpe}
          keyboardType="decimal-pad"
          placeholder="—"
          placeholderTextColor="#cbd5e1"
          className="text-sm font-bold text-slate-800 text-center"
          selectTextOnFocus
        />
      </View>

      {/* Complete */}
      <Pressable
        onPress={() =>
          onComplete(
            parseFloat(weight) || 0,
            parseInt(reps) || 0,
            rpe ? parseFloat(rpe) : null,
          )
        }
        className="w-14 bg-slate-900 rounded-[10px] py-2.5 items-center justify-center"
      >
        <Feather name="check" size={14} color="#fff" />
      </Pressable>

      {/* Delete */}
      <Pressable onPress={onDelete} className="w-7 items-center justify-center">
        <Feather name="trash-2" size={13} color="#cbd5e1" />
      </Pressable>
    </View>
  );
}
