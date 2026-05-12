import { View, Text } from "react-native";
import { Weight, Trophy, Target } from "lucide-react-native"; // Standard icon set
import type { StatsRowProps } from "@/types/workout";

export default function StatsRow({
  totalVolume,
  bestSet,
  est1rm,
}: StatsRowProps) {
  return (
    <View className="flex-row items-center justify-between bg-slate-50/50 border border-slate-100 px-3 py-1.5">
      {/* Total Volume */}
      <View className="flex-row items-center gap-1.5">
        <Weight size={12} color="#94a3b8" />
        <View>
          <Text className="text-[11px] font-bold text-slate-700">
            {totalVolume}
            <Text className="text-[9px] text-slate-400 font-medium"> kg</Text>
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View className="h-4 w-[1px] bg-slate-200" />

      {/* Best Set */}
      {bestSet && (
        <>
          <View className="flex-row items-center gap-1.5">
            <Trophy size={12} color="#94a3b8" />
            <Text className="text-[11px] font-bold text-slate-700">
              {bestSet.weight}×{bestSet.reps}
            </Text>
          </View>
          <View className="h-4 w-[1px] bg-slate-200" />
        </>
      )}

      {/* Est. 1RM */}
      {est1rm && (
        <View className="flex-row items-center gap-1.5">
          <Target size={12} color="#94a3b8" />
          <Text className="text-[11px] font-bold text-slate-700">
            {Math.round(est1rm)}
            <Text className="text-[9px] text-slate-400 font-medium"> 1RM</Text>
          </Text>
        </View>
      )}
    </View>
  );
}
