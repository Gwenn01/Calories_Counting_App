import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Layers, Dumbbell, Clock, Activity } from "lucide-react-native";
import type { WorkoutSession } from "@/types/workout";
import { CATEGORY_COLORS, formatDuration, formatTime } from "./helpers";

interface Props {
  session: WorkoutSession;
  completedSets: number;
  totalSets: number;
}

export default function SessionDayHeader({
  session,
  completedSets,
  totalSets,
}: Props) {
  const color = CATEGORY_COLORS[session.category] ?? "#64748b";

  return (
    <View className="bg-slate-900 px-5 py-5">
      {/* Top row */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <View
            className="px-2.5 py-0.5 rounded-full border"
            style={{ backgroundColor: color + "25", borderColor: color + "50" }}
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
            <View className="flex-row items-center gap-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-2 py-0.5">
              <Feather name="check-circle" size={10} color="#10b981" />
              <Text className="text-[10px] font-bold text-emerald-400">
                FINISHED
              </Text>
            </View>
          )}
        </View>

        {/* Time range */}
        <View className="flex-row items-center gap-1">
          <Text className="text-[11px] text-slate-500">
            {formatTime(session.start_time)}
          </Text>
          {session.end_time && (
            <View className="flex-row items-center gap-1">
              <Feather name="arrow-right" size={10} color="#475569" />
              <Text className="text-[11px] text-slate-500">
                {formatTime(session.end_time)}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Notes */}
      {session.notes ? (
        <View className="flex-row items-center gap-2 mb-3">
          <Feather name="message-circle" size={11} color="#64748b" />
          <Text
            className="text-xs text-slate-400 italic flex-1"
            numberOfLines={1}
          >
            "{session.notes}"
          </Text>
        </View>
      ) : null}

      <View className="flex-row justify-between items-center bg-slate-800/80 rounded-2xl px-4 py-2.5 mb-2">
        {/* Sets */}
        <View className="items-center">
          <View className="flex-row items-center gap-1 mb-0.5">
            <Layers size={12} color="#64748b" />
            <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Sets
            </Text>
          </View>
          <Text className="text-sm font-bold text-white">
            {completedSets}
            <Text className="text-[10px] text-slate-500 font-medium">
              /{totalSets}
            </Text>
          </Text>
        </View>

        {/* Volume */}
        <View className="items-center">
          <View className="flex-row items-center gap-1 mb-0.5">
            <Dumbbell size={12} color="#64748b" />
            <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Vol
            </Text>
          </View>
          <Text className="text-sm font-bold text-white">
            {session.total_volume.toLocaleString()}
            <Text className="text-[10px] text-slate-500 font-medium"> kg</Text>
          </Text>
        </View>

        {/* Duration */}
        <View className="items-center">
          <View className="flex-row items-center gap-1 mb-0.5">
            <Clock size={12} color="#64748b" />
            <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Time
            </Text>
          </View>
          <Text className="text-sm font-bold text-white">
            {formatDuration(session.duration_seconds)}
          </Text>
        </View>

        {/* Reps */}
        <View className="items-center">
          <View className="flex-row items-center gap-1 mb-0.5">
            <Activity size={12} color="#64748b" />
            <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Reps
            </Text>
          </View>
          <Text className="text-sm font-bold text-white">
            {session.total_reps}
          </Text>
        </View>
      </View>

      {/* Energy + mood */}
      <View className="flex-row gap-2">
        <View className="flex-1 bg-slate-800 rounded-[12px] px-3 py-2 flex-row items-center gap-2">
          <Feather name="zap" size={12} color="#f97316" />
          <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Energy
          </Text>
          <Text className="text-xs font-black text-white ml-auto">
            {session.energy_level}/10
          </Text>
        </View>
        <View className="flex-1 bg-slate-800 rounded-[12px] px-3 py-2 flex-row items-center gap-2">
          <Feather name="smile" size={12} color="#8b5cf6" />
          <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Mood
          </Text>
          <Text className="text-xs font-black text-white ml-auto">
            {session.mood_rating}/10
          </Text>
        </View>
      </View>
    </View>
  );
}
