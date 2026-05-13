import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

interface Props {
  isToday?: boolean;
}

export default function NoSessionCard({ isToday = false }: Props) {
  return (
    <View className="bg-white rounded-[24px] border border-slate-100 overflow-hidden mt-4">
      {/* Dark top bar */}
      <View className="bg-slate-900 px-5 py-5 items-center">
        <View className="flex-row items-center gap-1.5 mb-4">
          <Feather name="activity" size={11} color="#f97316" />
          <Text className="text-[10px] font-bold tracking-[2px] uppercase text-orange-400">
            Workout Session
          </Text>
        </View>

        <View className="w-14 h-14 rounded-[20px] bg-slate-800 border border-slate-700 items-center justify-center mb-4">
          <Feather name="calendar" size={24} color="#475569" />
        </View>

        <Text
          className="text-xl font-black text-white text-center mb-1"
          style={{ letterSpacing: -0.5 }}
        >
          {isToday ? "No Session Yet" : "Rest Day"}
        </Text>
        <Text className="text-xs text-slate-500 text-center leading-5">
          {isToday
            ? "You haven't started a session today."
            : "No workout was logged on this day."}
        </Text>
      </View>

      {/* Stats strip — all zeros */}
    </View>
  );
}
