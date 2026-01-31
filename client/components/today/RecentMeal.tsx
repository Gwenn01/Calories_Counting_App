import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MotiView } from "moti";

export function RecentMeal({ icon, title, subtitle, calories, color }: any) {
  return (
    <MotiView
      from={{
        opacity: 0,
        transform: [{ translateY: 20 }],
      }}
      animate={{
        opacity: 1,
        transform: [{ translateY: 0 }],
      }}
      transition={{ type: "timing", duration: 400 }}
      className="bg-white rounded-[32px] p-2 flex-row items-center border border-slate-100"
    >
      <View
        className={`w-20 h-20 rounded-[24px] items-center justify-center ${color}`}
      >
        <Feather name={icon} size={24} color="#0f172a" />
      </View>

      <View className="ml-4 flex-1">
        <Text className="text-slate-900 text-lg font-bold">{title}</Text>
        <Text className="text-slate-400 text-sm font-medium">{subtitle}</Text>
      </View>

      <View className="mr-6 items-end">
        <Text className="text-slate-900 font-black text-xl">{calories}</Text>
        <Text className="text-slate-400 text-[10px] font-bold uppercase">
          kcal
        </Text>
      </View>
    </MotiView>
  );
}
