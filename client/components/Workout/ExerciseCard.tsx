import { memo } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Exercise } from "@/types/workout";
import SetRowItem from "./SetRowItem";

interface ExerciseCardProps {
  exercise: Exercise;
  onSetWeightChange: (setId: string, val: string) => void;
  onSetRepsChange: (setId: string, val: string) => void;
  onCompleteSet: (setId: string) => void;
  onAddSet: () => void;
  onToggleFavorite: () => void;
  onNotesChange: (val: string) => void;
}

const ExerciseCard = memo(function ExerciseCard({
  exercise,
  onSetWeightChange,
  onSetRepsChange,
  onCompleteSet,
  onAddSet,
  onToggleFavorite,
  onNotesChange,
}: ExerciseCardProps) {
  const doneCount = exercise.sets.filter((s) => s.done).length;
  const total = exercise.sets.length;
  const progressPct = total > 0 ? (doneCount / total) * 100 : 0;

  return (
    <View className="bg-white rounded-[28px] border border-slate-100 shadow-sm mb-3 overflow-hidden">
      {/* Card header */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
        <View className="flex-1">
          <Text className="text-base font-bold text-slate-800">
            {exercise.name}
          </Text>
          <Text className="text-xs text-slate-400 font-medium mt-0.5">
            {doneCount}/{total} sets completed
          </Text>
        </View>

        <View className="flex-row items-center gap-x-2">
          {doneCount === total && total > 0 && (
            <View className="bg-green-100 rounded-lg px-2 py-1">
              <Text className="text-[10px] font-bold text-green-600">Done</Text>
            </View>
          )}
          <Pressable onPress={onToggleFavorite} hitSlop={8}>
            <Ionicons
              name={exercise.isFavorite ? "heart" : "heart-outline"}
              size={18}
              color={exercise.isFavorite ? "#f97316" : "#94a3b8"}
            />
          </Pressable>
        </View>
      </View>

      {/* Progress bar */}
      <View className="mx-4 mb-3 h-1 bg-slate-100 rounded-full overflow-hidden">
        <View
          className="h-1 bg-orange-400 rounded-full"
          style={{ width: `${progressPct}%` }}
        />
      </View>

      {/* Column headers */}
      <View className="flex-row items-center px-4 mb-1 gap-x-2">
        <Text className="w-7 text-[9px] font-bold text-slate-400 text-center uppercase tracking-wider">
          Set
        </Text>
        <Text className="flex-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
          Weight (lbs)
        </Text>
        <Text className="flex-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
          Reps
        </Text>
        <View className="w-9" />
      </View>

      {/* Divider */}
      <View className="h-px bg-slate-100 mx-4 mb-1" />

      {/* Set rows */}
      {exercise.sets.map((set, idx) => (
        <SetRowItem
          key={set.id}
          set={set}
          index={idx}
          onWeightChange={(val) => onSetWeightChange(set.id, val)}
          onRepsChange={(val) => onSetRepsChange(set.id, val)}
          onComplete={() => onCompleteSet(set.id)}
        />
      ))}

      {/* Notes */}
      <View className="mx-4 mt-2 mb-2">
        <TextInput
          value={exercise.notes}
          onChangeText={onNotesChange}
          placeholder="Add notes..."
          placeholderTextColor="#cbd5e1"
          multiline
          className="text-xs text-slate-500 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100"
        />
      </View>

      {/* Add Set button */}
      <Pressable
        onPress={onAddSet}
        className="flex-row items-center justify-center gap-x-1.5 mx-4 mb-4 py-2.5 rounded-xl border border-dashed border-orange-300 bg-orange-50/40"
      >
        <Ionicons name="add-circle-outline" size={15} color="#f97316" />
        <Text className="text-xs font-bold text-orange-500">Add Set</Text>
      </Pressable>
    </View>
  );
});

export default ExerciseCard;
