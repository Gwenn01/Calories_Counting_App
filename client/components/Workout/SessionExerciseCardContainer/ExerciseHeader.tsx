import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import type { ExerciseHeaderProps } from "@/types/workout";

const MUSCLE_COLORS: Record<string, string> = {
  chest: "#f97316",
  back: "#3b82f6",
  legs: "#8b5cf6",
  shoulders: "#10b981",
  biceps: "#f59e0b",
  triceps: "#ef4444",
  core: "#06b6d4",
};

export default function ExerciseHeader({
  workoutExercise,
  completedCount,
  notes,
  showNotes,
  savingNotes,
  togglingFav,
  deletingExercise,
  onToggleNotes,
  onChangeNotes,
  onBlurNotes,
  onToggleFavorite,
  onDeleteExercise,
}: ExerciseHeaderProps) {
  const muscleColor =
    MUSCLE_COLORS[workoutExercise.exercise.muscle_group] ?? "#64748b";
  const totalSets = workoutExercise.sets.length;
  const progress = totalSets > 0 ? completedCount / totalSets : 0;

  return (
    <View className="bg-slate-900 px-4 pt-4 pb-4">
      {/* Top row — icon + name + favorite */}
      <View className="flex-row items-center gap-3 mb-3">
        {/* Icon */}
        <View
          className="w-10 h-10 rounded-[12px] items-center justify-center"
          style={{
            backgroundColor: muscleColor + "25",
            borderWidth: 1,
            borderColor: muscleColor + "40",
          }}
        >
          <Feather name="zap" size={16} color={muscleColor} />
        </View>

        {/* Name + meta */}
        <View className="flex-1">
          <Text
            className="text-sm font-black text-white mb-0.5"
            numberOfLines={1}
            style={{ letterSpacing: -0.3 }}
          >
            {workoutExercise.exercise.name}
          </Text>
          <Text className="text-[11px] text-slate-500 capitalize">
            {workoutExercise.exercise.equipment} ·{" "}
            {workoutExercise.exercise.difficulty}
          </Text>
        </View>

        {/* Favorite */}
        <Pressable
          onPress={onToggleFavorite}
          disabled={togglingFav}
          className="w-8 h-8 rounded-[10px] items-center justify-center"
          style={{
            backgroundColor: workoutExercise.is_favorite
              ? "#f9731625"
              : "#1e293b",
            borderWidth: 1,
            borderColor: workoutExercise.is_favorite ? "#f9731650" : "#334155",
          }}
        >
          {togglingFav ? (
            <ActivityIndicator size="small" color="#f97316" />
          ) : (
            <Feather
              name={workoutExercise.is_favorite ? "star" : "star"}
              size={14}
              color={workoutExercise.is_favorite ? "#f97316" : "#475569"}
            />
          )}
        </Pressable>
      </View>

      {/* Progress bar + badges */}
      <View className="mb-3">
        {/* Progress bar */}
        <View className="h-1 bg-slate-700 rounded-full mb-2.5 overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{
              width: `${progress * 100}%`,
              backgroundColor: progress === 1 ? "#10b981" : muscleColor,
            }}
          />
        </View>

        {/* Badges row */}
        <View className="flex-row items-center gap-2">
          <View
            className="px-2.5 py-0.5 rounded-full"
            style={{
              backgroundColor: muscleColor + "20",
              borderWidth: 1,
              borderColor: muscleColor + "40",
            }}
          >
            <Text
              className="text-[7px] font-bold uppercase tracking-widest"
              style={{ color: muscleColor }}
            >
              {workoutExercise.exercise.muscle_group}
            </Text>
          </View>

          <View className="bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-full">
            <Text className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">
              {totalSets} sets
            </Text>
          </View>

          {completedCount > 0 && (
            <View className="bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              <Text className="text-[7px] font-bold text-emerald-400 uppercase tracking-widest">
                {completedCount}/{totalSets} done
              </Text>
            </View>
          )}

          {progress === 1 && (
            <View className="bg-emerald-500/20 border border-emerald-500/30 px-1 py-0.5 rounded-full ml-auto">
              <Text className="text-[7px] font-bold text-emerald-400 uppercase tracking-widest">
                ✓ Complete
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Action row */}
      <View className="flex-row gap-2">
        <Pressable
          onPress={onToggleNotes}
          className="flex-row items-center rounded-full px-3 py-1.5"
          style={{
            backgroundColor: showNotes ? "#f9731620" : "#1e293b",
            borderWidth: 1,
            borderColor: showNotes ? "#f9731640" : "#334155",
          }}
        >
          <Feather
            name="file-text"
            size={8}
            color={showNotes ? "#f97316" : "#64748b"}
          />
          <Text
            className="text-[11px] font-bold"
            style={{ color: showNotes ? "#f97316" : "#64748b" }}
          >
            Notes
          </Text>
        </Pressable>

        <Pressable
          onPress={onDeleteExercise}
          disabled={deletingExercise}
          className="flex-row items-center bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1.5 ml-auto"
        >
          {deletingExercise ? (
            <ActivityIndicator size="small" color="#ef4444" />
          ) : (
            <View className="flex-row items-center gap-1.5">
              <Feather name="trash-2" size={8} color="#ef4444" />
              <Text className="text-[11px] font-bold text-red-400">Remove</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Notes input */}
      {showNotes && (
        <View className="mt-3 bg-slate-800 border border-slate-700 rounded-[14px] px-3 py-2.5">
          <TextInput
            value={notes}
            onChangeText={onChangeNotes}
            placeholder="Add notes for this exercise…"
            placeholderTextColor="#475569"
            multiline
            style={{
              color: "#e2e8f0",
              fontSize: 12,
              minHeight: 40,
              textAlignVertical: "top",
            }}
            onBlur={onBlurNotes}
          />
          {savingNotes && (
            <View className="flex-row items-center gap-1.5 mt-1.5">
              <ActivityIndicator size="small" color="#f97316" />
              <Text className="text-[10px] text-slate-500">Saving…</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
