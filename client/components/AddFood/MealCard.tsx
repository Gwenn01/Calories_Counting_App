import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

interface MealCardProps {
  title: string;
  calories: number;
  onAdd: () => void;
}

export default function MealCard({ title, calories, onAdd }: MealCardProps) {
  return (
    // Removed margins, borders, and rounded corners since the parent wrapper handles it
    <View className="bg-white p-5 flex-row items-center justify-between border-b border-slate-100/60 z-10">
      <View className="flex-1 pr-4">
        <Text className="text-xl font-black text-slate-900 tracking-tight">
          {title}
        </Text>

        <Text className="text-sm font-semibold text-slate-400 mt-0.5">
          {calories > 0 ? `${calories} kcal` : "No food logged"}
        </Text>
      </View>

      {/* Modern Dark Action Pill */}
      <Pressable
        onPress={onAdd}
        className="flex-row items-center bg-slate-900 px-4 py-2 rounded-full active:bg-slate-800"
      >
        <Feather name="plus" size={16} color="#ffffff" />
        <Text className="ml-1.5 text-sm font-bold text-white">Add</Text>
      </Pressable>
    </View>
  );
}
