import { memo } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fmtTime } from "@/helpers/workout";

interface RestTimerProps {
  remaining: number;
  total: number;
  onSkip: () => void;
  onNextSet: () => void;
}

const RestTimer = memo(function RestTimer({
  remaining,
  total,
  onSkip,
  onNextSet,
}: RestTimerProps) {
  const pct = remaining / total;

  return (
    <View className="bg-white rounded-[32px] border border-slate-100 shadow-lg mx-1 mb-3 p-5 items-center">
      {/* Label */}
      <View className="flex-row items-center gap-x-1.5 mb-4">
        <Ionicons name="timer-outline" size={15} color="#f97316" />
        <Text className="text-xs font-bold text-orange-500 tracking-widest uppercase">
          Rest Timer
        </Text>
      </View>

      {/* Circular ring (View-based approximation) */}
      <View className="w-28 h-28 items-center justify-center mb-4">
        {/* Background ring */}
        <View className="absolute w-28 h-28 rounded-full border-[6px] border-slate-100" />
        {/* Progress ring — opacity approximation; swap with react-native-svg for production arc */}
        <View
          className="absolute w-28 h-28 rounded-full border-[6px] border-orange-400"
          style={{ opacity: pct }}
        />
        <View className="items-center">
          <Text className="text-3xl font-black text-slate-800">
            {fmtTime(remaining)}
          </Text>
          <Text className="text-[10px] font-semibold text-slate-400 tracking-wider">
            REST
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row gap-x-3 w-full">
        <Pressable
          onPress={onSkip}
          className="flex-1 py-3 rounded-2xl border border-slate-200 bg-slate-50 items-center"
        >
          <Text className="text-sm font-bold text-slate-500">Skip Rest</Text>
        </Pressable>
        <Pressable
          onPress={onNextSet}
          className="flex-1 py-3 rounded-2xl bg-orange-500 items-center shadow-sm"
        >
          <Text className="text-sm font-bold text-white">Next Set</Text>
        </Pressable>
      </View>
    </View>
  );
});

export default RestTimer;
