// components/CaloriesCard.tsx
import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

interface MacroItem {
  label: string;
  value: number;
  goal: number;
  unit: string;
  bg: string;
  track: string;
}

interface CaloriesCardProps {
  currentCalories: number;
  caloriesGoal: number;
  caloriesRemaining: number;
  macros: MacroItem[];
}

export function CaloriesCard({
  currentCalories,
  caloriesGoal,
  caloriesRemaining,
  macros,
}: CaloriesCardProps) {
  const calorieProgress = Math.min(
    (currentCalories / caloriesGoal) * 100 || 0,
    100,
  );

  return (
    <View className="bg-slate-900 rounded-[36px] p-6 mb-6">
      {/* Top: Calories */}
      <View className="flex-row justify-between items-start mb-5">
        <View>
          <Text className="text-emerald-400 font-bold text-xs uppercase mb-1.5 tracking-widest">
            Calories Consumed
          </Text>
          <View className="flex-row items-baseline gap-1">
            <Text className="text-5xl font-black text-white tracking-tighter">
              {currentCalories}
            </Text>
            <Text className="text-base font-medium text-slate-500">
              / {caloriesGoal}
            </Text>
          </View>
        </View>
        <View className="bg-slate-800 h-11 w-11 rounded-full items-center justify-center border border-slate-700">
          <Feather name="zap" size={20} color="#34d399" />
        </View>
      </View>

      {/* Calorie progress bar */}
      <View className="h-2 bg-slate-800 rounded-full overflow-hidden mb-1.5">
        <View
          className="h-full bg-emerald-500 rounded-full"
          style={{ width: `${calorieProgress}%` }}
        />
      </View>
      <Text className="text-slate-400 text-xs font-medium mb-5">
        <Text className="text-white font-bold">{caloriesRemaining}</Text> kcal
        remaining
      </Text>

      {/* Divider */}
      <View className="h-px bg-slate-800 mb-5" />

      {/* Macros */}
      <View className="flex-row gap-3">
        {macros.map((macro) => {
          const progress = Math.min((macro.value / macro.goal) * 100 || 0, 100);
          return (
            <View key={macro.label} className="flex-1">
              <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                {macro.label}
              </Text>
              <View className="flex-row items-baseline gap-0.5 mb-1.5">
                <Text className="text-xl font-black text-white">
                  {macro.value}
                </Text>
                <Text className="text-[10px] text-slate-500 font-bold">
                  /{macro.goal}
                  {macro.unit}
                </Text>
              </View>
              <View
                className={`w-full h-1 ${macro.track} rounded-full overflow-hidden opacity-40`}
              >
                <View
                  className={`h-full ${macro.bg} rounded-full`}
                  style={{ width: `${progress}%` }}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
