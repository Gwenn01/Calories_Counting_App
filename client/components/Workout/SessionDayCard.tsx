import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import type { WorkoutSession } from "@/types/workout";

const CATEGORY_COLORS: Record<string, string> = {
  push: "#f97316",
  pull: "#3b82f6",
  legs: "#8b5cf6",
  full_body: "#10b981",
};

const formatDuration = (seconds: number | null) => {
  if (!seconds) return "In progress";
  const m = Math.floor(seconds / 60);
  const h = Math.floor(m / 60);
  return h > 0 ? `${h}h ${m % 60}m` : `${m}m`;
};

interface Props {
  session: WorkoutSession;
  isToday: boolean;
}

export default function SessionDayCard({ session, isToday }: Props) {
  const color = CATEGORY_COLORS[session.category] ?? "#64748b";
  const completedSets = session.workout_exercises.reduce(
    (acc, we) => acc + we.sets.filter((s) => s.completed).length,
    0,
  );
  const totalSets = session.workout_exercises.reduce(
    (acc, we) => acc + we.sets.length,
    0,
  );

  return (
    <View className="bg-white rounded-[24px] border border-slate-100 overflow-hidden mt-4">
      {/* Dark header */}
      <View className="bg-slate-900 px-5 py-5">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2">
            <View
              className="px-2.5 py-0.5 rounded-full border"
              style={{
                backgroundColor: color + "25",
                borderColor: color + "50",
              }}
            >
              <Text
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color }}
              >
                {session.category.replace("_", " ")}
              </Text>
            </View>

            {!session.is_finished ? (
              <View className="flex-row items-center gap-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-2 py-0.5">
                <View className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <Text className="text-[10px] font-bold text-emerald-400">
                  ACTIVE
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center gap-1 bg-slate-700 rounded-full px-2 py-0.5">
                <Feather name="check" size={10} color="#94a3b8" />
                <Text className="text-[10px] font-bold text-slate-400">
                  DONE
                </Text>
              </View>
            )}
          </View>

          <Text className="text-[11px] text-slate-500">
            {new Date(session.start_time).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        {session.notes ? (
          <Text className="text-sm text-slate-300 mb-3" numberOfLines={1}>
            "{session.notes}"
          </Text>
        ) : null}

        {/* Stats */}
        <View className="flex-row gap-3">
          <View className="flex-1 bg-slate-800 rounded-[12px] px-3 py-2.5 items-center">
            <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">
              Sets
            </Text>
            <Text className="text-base font-black text-white">
              {completedSets}
              <Text className="text-xs text-slate-500">/{totalSets}</Text>
            </Text>
          </View>
          <View className="flex-1 bg-slate-800 rounded-[12px] px-3 py-2.5 items-center">
            <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">
              Volume
            </Text>
            <Text className="text-base font-black text-white">
              {session.total_volume}
              <Text className="text-xs text-slate-500"> kg</Text>
            </Text>
          </View>
          <View className="flex-1 bg-slate-800 rounded-[12px] px-3 py-2.5 items-center">
            <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">
              Duration
            </Text>
            <Text className="text-base font-black text-white">
              {formatDuration(session.duration_seconds)}
            </Text>
          </View>
        </View>
      </View>

      {/* Exercise list */}
      <View className="px-4 py-3 gap-2">
        {session.workout_exercises.slice(0, 3).map((we) => (
          <View
            key={we.id}
            className="flex-row items-center gap-3 bg-slate-50 rounded-[12px] px-3 py-2.5"
          >
            <View className="w-7 h-7 rounded-[8px] bg-orange-50 items-center justify-center">
              <Feather name="zap" size={12} color="#f97316" />
            </View>
            <Text
              className="flex-1 text-xs font-bold text-slate-700"
              numberOfLines={1}
            >
              {we.exercise.name}
            </Text>
            <Text className="text-[11px] text-slate-400">
              {we.sets.length} sets
            </Text>
          </View>
        ))}
        {session.workout_exercises.length > 3 && (
          <Text className="text-[11px] text-slate-400 text-center py-1">
            +{session.workout_exercises.length - 3} more exercises
          </Text>
        )}
      </View>

      {/* Resume button — only today + not finished */}
      {isToday && !session.is_finished && (
        <View className="px-4 pb-4">
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/workout/session/[id]",
                params: { id: session.id },
              })
            }
            className="bg-slate-900 rounded-[14px] py-3.5 flex-row items-center justify-center gap-2"
          >
            <Feather name="play" size={15} color="#fff" />
            <Text className="text-sm font-black text-white uppercase tracking-wide">
              Resume Session
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
