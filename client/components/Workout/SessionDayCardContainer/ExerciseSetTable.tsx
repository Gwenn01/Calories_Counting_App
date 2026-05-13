import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { WorkoutExercise } from "@/types/workout";

interface Props {
  workoutExercise: WorkoutExercise;
}

export default function ExerciseSetTable({ workoutExercise: we }: Props) {
  return (
    <View className="border-t border-slate-100 px-2 pb-2 pt-2 gap-1">
      {/* Column headers with Icons */}
      <View className="flex-row items-center px-1 mb-1">
        <View className="w-7 items-center">
          <Feather name="hash" size={10} color="#94a3b8" />
        </View>

        <View className="flex-1 flex-row items-center justify-center gap-1">
          <Feather name="layers" size={10} color="#94a3b8" />
          <Text className="text-[9px] font-bold text-slate-400 uppercase">
            Kg
          </Text>
        </View>

        <View className="flex-1 flex-row items-center justify-center gap-1">
          <Feather name="refresh-cw" size={10} color="#94a3b8" />
          <Text className="text-[9px] font-bold text-slate-400 uppercase">
            Reps
          </Text>
        </View>

        <View className="flex-1 flex-row items-center justify-center gap-1">
          <Feather name="activity" size={10} color="#94a3b8" />
          <Text className="text-[9px] font-bold text-slate-400 uppercase">
            RPE
          </Text>
        </View>

        <View className="flex-1 flex-row items-center justify-center gap-1">
          <Feather name="clock" size={10} color="#94a3b8" />
          <Text className="text-[9px] font-bold text-slate-400 uppercase">
            Rest
          </Text>
        </View>

        {/* Spacer for tags alignment */}
        <View className="w-10" />
      </View>

      {/* Set rows */}
      {we.sets.map((s) => (
        <View
          key={s.id}
          className="flex-row items-center bg-slate-50 rounded-lg px-1 py-1.5"
        >
          {/* Set Number */}
          <View className="w-7 items-center">
            <View className="w-4 h-4 rounded-full bg-slate-200 items-center justify-center">
              <Text className="text-[8px] font-black text-slate-500">
                {s.set_number}
              </Text>
            </View>
          </View>

          {/* Weight */}
          <Text className="flex-1 text-[11px] font-black text-slate-700 text-center">
            {s.weight}
          </Text>

          {/* Reps */}
          <Text className="flex-1 text-[11px] font-black text-slate-700 text-center">
            {s.reps}
          </Text>

          {/* RPE */}
          <Text className="flex-1 text-[11px] font-bold text-slate-400 text-center">
            {s.rpe ?? "—"}
          </Text>

          {/* Rest */}
          <Text className="flex-1 text-[11px] font-bold text-slate-400 text-center">
            {s.rest_taken ?? s.rest_target}s
          </Text>

          {/* Tags */}
          <View className="w-10 flex-row gap-0.5 justify-end pr-1">
            {s.is_pr && (
              <View className="bg-amber-100 rounded flex-row items-center justify-center px-1 py-0.5">
                <Text className="text-[7px] font-black text-amber-600">PR</Text>
              </View>
            )}
            {s.is_warmup && (
              <View className="bg-blue-100 rounded flex-row items-center justify-center px-1.5 py-0.5">
                <Text className="text-[7px] font-black text-blue-600">W</Text>
              </View>
            )}
            {s.is_dropset && (
              <View className="bg-purple-100 rounded flex-row items-center justify-center px-1.5 py-0.5">
                <Text className="text-[7px] font-black text-purple-600">D</Text>
              </View>
            )}
          </View>
        </View>
      ))}

      {/* Exercise notes */}
      {we.notes ? (
        <View className="flex-row items-start gap-1.5 mt-0.5 px-2">
          <Feather
            name="message-square"
            size={10}
            color="#94a3b8"
            style={{ marginTop: 2 }}
          />
          <Text className="text-[10px] text-slate-500 italic flex-1 leading-tight">
            {we.notes}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
