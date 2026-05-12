import { View, Text } from "react-native";
import type { StatsRowProps } from "@/types/workout";

export default function StatsRow({
  totalVolume,
  bestSet,
  est1rm,
}: StatsRowProps) {
  return (
    <View className="flex-row gap-2 mx-3 mb-3">
      <View className="flex-1 bg-slate-50 border border-slate-100 rounded-[10px] px-2 py-2 items-center">
        <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
          Volume
        </Text>
        <Text className="text-sm font-black text-slate-700">
          {totalVolume}
          <Text className="text-[10px] text-slate-400 font-normal"> kg</Text>
        </Text>
      </View>

      {bestSet && (
        <View className="flex-1 bg-slate-50 border border-slate-100 rounded-[10px] px-2 py-2 items-center">
          <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
            Best set
          </Text>
          <Text className="text-sm font-black text-slate-700">
            {bestSet.weight}×{bestSet.reps}
          </Text>
        </View>
      )}

      {est1rm && (
        <View className="flex-1 bg-slate-50 border border-slate-100 rounded-[10px] px-2 py-2 items-center">
          <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
            Est. 1RM
          </Text>
          <Text className="text-sm font-black text-slate-700">
            {Math.round(est1rm)}
            <Text className="text-[10px] text-slate-400 font-normal"> kg</Text>
          </Text>
        </View>
      )}
    </View>
  );
}
