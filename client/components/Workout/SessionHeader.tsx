import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { WorkoutSession } from "@/types/workout";
import { getCategoryMeta } from "@/components/Workout/StartSessionCardContainer/helpers";

interface Props {
  session: WorkoutSession;
  onBack: () => void;
}

export default function SessionHeader({ session, onBack }: Props) {
  const meta = getCategoryMeta(session.category);

  return (
    <View className="bg-slate-900 px-5 pt-5 pb-6 mb-4">
      {/* Top row */}
      <View className="flex-row items-center justify-between mb-5">
        <Pressable
          onPress={onBack}
          className="w-9 h-9 rounded-[12px] bg-slate-800 items-center justify-center"
        >
          <Feather name="chevron-left" size={18} color="#fff" />
        </Pressable>

        <View className="flex-row items-center gap-1.5">
          <Feather name="activity" size={11} color="#f97316" />
          <Text className="text-[10px] font-bold tracking-[2px] uppercase text-orange-400">
            Active Session
          </Text>
        </View>

        {/* Live indicator */}
        <View className="flex-row items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-2.5 py-1">
          <View className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <Text className="text-[10px] font-bold text-emerald-400">LIVE</Text>
        </View>
      </View>

      {/* Title */}
      <Text
        className="text-2xl font-black text-white mb-2"
        style={{ letterSpacing: -0.5 }}
      >
        {session.workout_exercises[0]?.exercise?.name
          ? `Day ${session.id} Session`
          : "Workout Session"}
      </Text>

      {/* Meta row */}
      <View className="flex-row items-center gap-3">
        <View
          className="px-2.5 py-0.5 rounded-full border"
          style={{
            backgroundColor: meta.color + "25",
            borderColor: meta.color + "50",
          }}
        >
          <Text
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: meta.color }}
          >
            {meta.label}
          </Text>
        </View>
        <Text className="text-xs text-slate-400">
          {new Date(session.date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </Text>
        {session.notes ? (
          <Text className="text-xs text-slate-500 flex-1" numberOfLines={1}>
            · {session.notes}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
