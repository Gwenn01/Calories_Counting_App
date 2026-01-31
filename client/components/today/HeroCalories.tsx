import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MotiView } from "moti";
import { useMacroStore } from "@/store/macro.store";

export function HeroCalories() {
  const { consumed, targets } = useMacroStore();
  const remaining = targets.calories - consumed.calories;

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-emerald-400 rounded-[48px] p-8 mb-6 overflow-hidden"
    >
      <View className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full" />

      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-emerald-950/60 text-xs font-bold uppercase tracking-widest">
            Remaining
          </Text>
          <Text className="text-emerald-950 text-6xl font-black tracking-tighter">
            {remaining}
          </Text>
          <Text className="text-emerald-950/80 font-medium mt-1">
            kcal to go
          </Text>
        </View>

        <View className="w-24 h-24 items-center justify-center">
          <View className="w-24 h-24 rounded-full border-[6px] border-emerald-900/10 absolute" />
          <Feather name="zap" size={26} color="#064e3b" />
        </View>
      </View>
    </MotiView>
  );
}
