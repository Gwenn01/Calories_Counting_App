// components/StepsCard.tsx
import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

interface StatItem {
  label: string;
  value: string;
  unit: string;
  progress: number;
}

interface StepsCardProps {
  currentSteps: number;
  stepsGoal: number;
  stats: StatItem[];
}

export function StepsCard({ currentSteps, stepsGoal, stats }: StepsCardProps) {
  const stepsRemaining = Math.max(stepsGoal - currentSteps, 0);
  const stepsProgress = Math.min((currentSteps / stepsGoal) * 100 || 0, 100);

  return (
    <View className="bg-[#1e1b4b] rounded-[36px] p-6 mb-6">
      {/* Top: Step count */}
      <View className="flex-row justify-between items-start mb-5">
        <View>
          <Text className="text-[#a5b4fc] font-bold text-xs uppercase mb-1.5 tracking-widest">
            Steps Today
          </Text>
          <View className="flex-row items-baseline gap-1.5">
            <Text className="text-5xl font-black text-white tracking-tighter">
              {currentSteps.toLocaleString()}
            </Text>
            <Text className="text-base font-medium text-[#4c4a7a]">
              / {stepsGoal.toLocaleString()}
            </Text>
          </View>
        </View>
        <View className="bg-[#2d2a6e] h-11 w-11 rounded-full items-center justify-center border border-[#3d3a7e]">
          <Feather name="zap" size={20} color="#818cf8" />
        </View>
      </View>

      {/* Steps progress bar */}
      <View className="h-2 bg-[#2d2a6e] rounded-full overflow-hidden mb-1.5">
        <View
          className="h-full bg-[#6366f1] rounded-full"
          style={{ width: `${stepsProgress}%` }}
        />
      </View>
      <Text className="text-[#4c4a7a] text-xs font-medium text-center mb-5">
        <Text className="text-white font-bold">
          {stepsRemaining.toLocaleString()}
        </Text>{" "}
        steps to goal
      </Text>

      {/* Divider */}
      <View className="h-px bg-[#2d2a6e] mb-5" />

      {/* Sub-stats */}
      <View className="flex-row gap-3">
        {stats.map((stat) => (
          <View key={stat.label} className="flex-1">
            <Text className="text-[10px] font-bold text-[#4c4a7a] uppercase tracking-widest mb-1">
              {stat.label}
            </Text>
            <Text className="text-xl font-black text-white tracking-tight">
              {stat.value}
            </Text>
            <Text className="text-[10px] font-bold text-[#4c4a7a] mb-1.5">
              {stat.unit}
            </Text>
            <View className="w-full h-1 bg-[#2d2a6e] rounded-full overflow-hidden">
              <View
                className="h-full bg-[#6366f1] rounded-full"
                style={{ width: `${stat.progress}%` }}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
