import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

interface MealCardProps {
  title: string;
  calories: number;
  onAdd: () => void;
}

export default function MealCard({ title, calories, onAdd }: MealCardProps) {
  return (
    <View className="bg-white rounded-[24px] p-4 mt-4 border border-slate-100 shadow-sm flex-row items-center justify-between">
      <View className="flex-1 pr-4">
        <Text className="text-base font-bold text-slate-800 tracking-tight">
          {title}
        </Text>

        <Text className="text-sm font-medium text-slate-500 mt-0.5">
          {calories > 0 ? `${calories} kcal` : "No food logged"}
        </Text>
      </View>

      <Pressable
        onPress={onAdd}
        className="flex-row items-center bg-emerald-500 px-4 py-2.5 rounded-full active:bg-emerald-600"
      >
        <Feather name="plus" size={16} color="#ffffff" />

        <Text className="ml-1.5 text-sm font-semibold text-white tracking-wide">
          Add Food
        </Text>
      </Pressable>
    </View>
  );
}
