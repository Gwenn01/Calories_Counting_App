import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  totalFoods?: number;
};

export const FoodListHeading = ({ totalFoods }: Props) => (
  <View className="flex-row items-center justify-between mt-4 mb-1 bg-slate-900 border border-slate-700/50 rounded-3xl px-4 py-4">
    {/* Left: text content */}
    <View className="flex-1 pr-4">
      {/* Status pill */}
      <View className="flex-row items-center self-start gap-1.5 rounded-full px-2.5 py-0.5 mb-1.5 border border-emerald-500/30 bg-emerald-500/10">
        <MaterialCommunityIcons
          name="database-outline"
          size={12}
          color="#10b981"
        />
        <Text className="text-[10px] font-semibold text-emerald-400 tracking-widest uppercase">
          Food Database
        </Text>
      </View>

      {/* Title */}
      <Text
        className="text-slate-100 leading-tight"
        style={{ fontSize: 22, fontWeight: "800", letterSpacing: -0.6 }}
      >
        Manage <Text className="text-emerald-500">Food</Text>
      </Text>

      {/* Subtitle + total count inline */}
      <View className="flex-row items-center gap-2 mt-0.5">
        <Text className="text-xs text-slate-500">
          Track & organize your foods library
        </Text>
        <View className="w-1 h-1 rounded-full bg-slate-700" />
        <View className="flex-row items-center gap-1">
          <Text className="text-xs font-bold text-emerald-500">
            {totalFoods}
          </Text>
          <Text className="text-xs text-slate-500">foods</Text>
        </View>
      </View>
    </View>

    {/* Right: icon badge */}
    <View className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 items-center justify-center">
      <MaterialCommunityIcons
        name="food-apple-outline"
        size={20}
        color="#10b981"
      />
    </View>
  </View>
);
