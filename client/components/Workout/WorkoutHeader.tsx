import { memo } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { WorkoutType } from "@/types/workout";

interface WorkoutHeaderProps {
  currentDate: Date;
  workoutType: WorkoutType;
  onPrev: () => void;
  onNext: () => void;
  onTypeChange: () => void;
}

const WorkoutHeader = memo(function WorkoutHeader({
  currentDate,
  workoutType,
  onPrev,
  onNext,
  onTypeChange,
}: WorkoutHeaderProps) {
  const dateLabel = currentDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });
  const isToday = currentDate.toDateString() === new Date().toDateString();

  return (
    <View className="mb-3">
      {/* Date row */}
      <View className="flex-row items-center justify-between mb-2">
        <Pressable
          onPress={onPrev}
          className="w-9 h-9 rounded-xl bg-white border border-slate-100 items-center justify-center shadow-sm"
        >
          <Ionicons name="chevron-back" size={16} color="#475569" />
        </Pressable>

        <View className="items-center">
          <Text className="text-xs font-semibold text-slate-400 tracking-widest uppercase mb-0.5">
            Workout Session
          </Text>
          <Text className="text-base font-bold text-slate-800">
            {isToday ? "Today" : dateLabel}
          </Text>
        </View>

        <Pressable
          onPress={onNext}
          className="w-9 h-9 rounded-xl bg-white border border-slate-100 items-center justify-center shadow-sm"
        >
          <Ionicons name="chevron-forward" size={16} color="#475569" />
        </Pressable>
      </View>

      {/* Workout type badge */}
      <Pressable
        onPress={onTypeChange}
        className="self-center flex-row items-center gap-x-1 bg-orange-50 border border-orange-200 rounded-xl px-3 py-1.5"
      >
        <Ionicons name="barbell-outline" size={13} color="#f97316" />
        <Text className="text-xs font-bold text-orange-500">{workoutType}</Text>
        <Ionicons name="chevron-down" size={11} color="#f97316" />
      </Pressable>
    </View>
  );
});

export default WorkoutHeader;
