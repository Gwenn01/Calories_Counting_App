import { memo } from "react";
import { View, Text } from "react-native";
import type { Exercise } from "@/types/workout";

interface SummaryExerciseCardProps {
  exercise: Exercise;
}

const SummaryExerciseCard = memo(function SummaryExerciseCard({
  exercise,
}: SummaryExerciseCardProps) {
  const doneSets = exercise.sets.filter((s) => s.done);

  const volume = doneSets.reduce(
    (acc, s) => acc + (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0),
    0,
  );

  const bestWeight =
    doneSets.length > 0
      ? Math.max(...doneSets.map((s) => parseFloat(s.weight) || 0))
      : 0;

  const bestReps =
    doneSets.length > 0
      ? Math.max(...doneSets.map((s) => parseInt(s.reps) || 0))
      : 0;

  return (
    <View className="bg-white rounded-[24px] border border-slate-100 shadow-sm mb-3 overflow-hidden">
      {/* Exercise name + set count */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-slate-50">
        <Text className="text-sm font-bold text-slate-800">
          {exercise.name}
        </Text>
        <View className="bg-green-100 rounded-lg px-2 py-0.5">
          <Text className="text-[10px] font-bold text-green-600">
            {doneSets.length} sets
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View className="px-4 py-3 flex-row gap-x-6">
        <View>
          <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Volume
          </Text>
          <Text className="text-sm font-black text-slate-800">
            {volume.toLocaleString()} lbs
          </Text>
        </View>
        <View>
          <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Best Set
          </Text>
          <Text className="text-sm font-black text-slate-800">
            {doneSets.length > 0 ? `${bestWeight} × ${bestReps}` : "—"}
          </Text>
        </View>
      </View>
    </View>
  );
});

export default SummaryExerciseCard;
