import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import type { ExerciseHeaderProps } from "@/types/workout";

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
  return (
    <View className="px-4 pt-4 pb-3 border-b border-slate-100">
      <View className="flex-row items-start gap-3">
        <View className="w-9 h-9 rounded-[10px] bg-orange-50 border border-orange-100 items-center justify-center">
          <Feather name="zap" size={15} color="#f97316" />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text
              className="text-sm font-black text-slate-800 flex-1 mr-2"
              numberOfLines={1}
            >
              {workoutExercise.exercise.name}
            </Text>
            <Pressable onPress={onToggleFavorite} disabled={togglingFav}>
              <Feather
                name="star"
                size={15}
                color={workoutExercise.is_favorite ? "#f97316" : "#cbd5e1"}
              />
            </Pressable>
          </View>

          <Text className="text-[11px] text-slate-400 capitalize mt-0.5">
            {workoutExercise.exercise.muscle_group} ·{" "}
            {workoutExercise.exercise.equipment} ·{" "}
            {workoutExercise.exercise.difficulty}
          </Text>

          <View className="flex-row gap-1.5 mt-2 flex-wrap">
            <View className="bg-orange-50 border border-orange-100 rounded-full px-2 py-0.5">
              <Text className="text-[10px] font-bold text-orange-600 capitalize">
                {workoutExercise.exercise.muscle_group}
              </Text>
            </View>
            <View className="bg-slate-50 border border-slate-200 rounded-full px-2 py-0.5">
              <Text className="text-[10px] font-bold text-slate-500">
                {workoutExercise.sets.length} sets
              </Text>
            </View>
            {completedCount > 0 && (
              <View className="bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">
                <Text className="text-[10px] font-bold text-emerald-600">
                  {completedCount} done
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Action row */}
      <View className="flex-row gap-2 mt-3">
        <Pressable
          onPress={onToggleNotes}
          className="flex-row items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5"
        >
          <Feather name="file-text" size={11} color="#64748b" />
          <Text className="text-[11px] font-bold text-slate-500">Notes</Text>
        </Pressable>

        <Pressable
          onPress={onDeleteExercise}
          disabled={deletingExercise}
          className="flex-row items-center gap-1.5 bg-red-50 border border-red-100 rounded-full px-3 py-1.5 ml-auto"
        >
          <Feather name="trash-2" size={11} color="#ef4444" />
          <Text className="text-[11px] font-bold text-red-400">Remove</Text>
        </Pressable>
      </View>

      {/* Notes input */}
      {showNotes && (
        <View className="mt-3 bg-slate-50 border border-slate-200 rounded-[12px] px-3 py-2">
          <TextInput
            value={notes}
            onChangeText={onChangeNotes}
            placeholder="Add notes for this exercise…"
            placeholderTextColor="#cbd5e1"
            multiline
            className="text-xs text-slate-700 min-h-[40px]"
            onBlur={onBlurNotes}
          />
          {savingNotes && (
            <ActivityIndicator
              size="small"
              color="#94a3b8"
              style={{ alignSelf: "flex-end" }}
            />
          )}
        </View>
      )}
    </View>
  );
}
