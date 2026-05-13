import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { WorkoutExercise } from "@/types/workout";
import { MUSCLE_COLORS } from "./helpers";
import ExerciseSetTable from "./ExerciseSetTable";

interface Props {
  exercises: WorkoutExercise[];
}

export default function ExerciseBreakdown({ exercises }: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <View className="px-4 py-3 gap-2.5">
      <View className="flex-row items-center gap-1.5 mb-1">
        <Feather name="layers" size={11} color="#94a3b8" />
        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Exercises ({exercises.length})
        </Text>
      </View>

      {exercises.map((we) => {
        const muscleColor =
          MUSCLE_COLORS[we.exercise.muscle_group] ?? "#64748b";
        const completedSets = we.sets.filter((s) => s.completed).length;
        const isExpanded = expandedId === we.id;
        const bestSet = we.best_set;

        return (
          <View
            key={we.id}
            className="bg-slate-50 border border-slate-100 rounded-[16px] overflow-hidden"
          >
            <Pressable
              onPress={() => setExpandedId(isExpanded ? null : we.id)}
              className="flex-row items-center gap-3 px-3 py-3"
            >
              <View
                className="w-8 h-8 rounded-[10px] items-center justify-center"
                style={{
                  backgroundColor: muscleColor + "20",
                  borderWidth: 1,
                  borderColor: muscleColor + "30",
                }}
              >
                <Feather name="zap" size={13} color={muscleColor} />
              </View>

              <View className="flex-1">
                <Text
                  className="text-xs font-black text-slate-800 mb-0.5"
                  numberOfLines={1}
                >
                  {we.exercise.name}
                </Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-[10px] text-slate-400">
                    {completedSets} sets
                  </Text>
                  <Text className="text-[10px] text-slate-300">·</Text>
                  <Text className="text-[10px] text-slate-400">
                    {we.total_volume.toLocaleString()} kg
                  </Text>
                  {bestSet && (
                    <View className="flex-row items-center gap-1">
                      <Text className="text-[10px] text-slate-300">·</Text>
                      <Text className="text-[10px] text-slate-400">
                        Best {bestSet.weight}kg×{bestSet.reps}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View className="flex-row items-center gap-1.5">
                {we.is_favorite && (
                  <Feather name="star" size={12} color="#f97316" />
                )}
                <Feather
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={14}
                  color="#94a3b8"
                />
              </View>
            </Pressable>

            {isExpanded && <ExerciseSetTable workoutExercise={we} />}
          </View>
        );
      })}
    </View>
  );
}
