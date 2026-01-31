import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

export function CompactStat({ label, value, icon, color }: any) {
  return (
    <View className="flex-1 bg-white/60 p-4 rounded-[28px] border border-white/20">
      <View className="flex-row items-center mb-2">
        <Feather name={icon} size={14} color={color} />
        <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-2">
          {label}
        </Text>
      </View>
      <Text className="text-slate-900 text-xl font-black">{value}</Text>
    </View>
  );
}
