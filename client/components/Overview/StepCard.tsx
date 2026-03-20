// components/StepsCard.tsx
import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MotiView } from "moti";

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
    //  Card slides up + fades on mount
    <MotiView
      from={{ opacity: 0, translateY: 24, scale: 0.97 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
      className="bg-[#1e1b4b] rounded-[36px] p-6 mb-6"
    >
      {/* Top: Step count */}
      <View className="flex-row justify-between items-start mb-5">
        <View>
          {/*  Label slides in from left */}
          <MotiView
            from={{ opacity: 0, translateX: -12 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: "timing", duration: 350, delay: 100 }}
          >
            <Text className="text-[#a5b4fc] font-bold text-xs uppercase mb-1.5 tracking-widest">
              Steps Today
            </Text>
          </MotiView>

          {/*  Step count pops in */}
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 16,
              delay: 180,
            }}
          >
            <View className="flex-row items-baseline gap-1.5">
              <Text className="text-5xl font-black text-white tracking-tighter">
                {currentSteps.toLocaleString()}
              </Text>
              <Text className="text-base font-medium text-[#4c4a7a]">
                / {stepsGoal.toLocaleString()}
              </Text>
            </View>
          </MotiView>
        </View>

        {/* Icon bounces in with rotation */}
        <MotiView
          from={{ opacity: 0, scale: 0.4, rotate: "-30deg" }}
          animate={{ opacity: 1, scale: 1, rotate: "0deg" }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 14,
            delay: 200,
          }}
          className="bg-[#2d2a6e] h-11 w-11 rounded-full items-center justify-center border border-[#3d3a7e]"
        >
          <Feather name="zap" size={20} color="#818cf8" />
        </MotiView>
      </View>

      {/*  Steps progress bar grows from 0 */}
      <View className="h-2 bg-[#2d2a6e] rounded-full overflow-hidden mb-1.5">
        <MotiView
          from={{ width: "0%" as `${number}%` }}
          animate={{ width: `${stepsProgress}%` as `${number}%` }}
          transition={{ type: "timing", duration: 800, delay: 300 }}
          className="h-full bg-[#6366f1] rounded-full"
        />
      </View>

      {/*  Remaining text fades after bar */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "timing", duration: 300, delay: 500 }}
      >
        <Text className="text-[#4c4a7a] text-xs font-medium text-center mb-5">
          <Text className="text-white font-bold">
            {stepsRemaining.toLocaleString()}
          </Text>{" "}
          steps to goal
        </Text>
      </MotiView>

      {/*  Divider scales left to right */}
      <MotiView
        from={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ type: "timing", duration: 400, delay: 350 }}
        style={{ transformOrigin: "left" }}
        className="h-px bg-[#2d2a6e] mb-5"
      />

      {/* Sub-stats */}
      <View className="flex-row gap-3">
        {stats.map((stat, index) => (
          //  Each stat staggered slide up
          <MotiView
            key={stat.label}
            from={{ opacity: 0, translateY: 14 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 16,
              delay: 420 + index * 80,
            }}
            className="flex-1"
          >
            <Text className="text-[10px] font-bold text-[#4c4a7a] uppercase tracking-widest mb-1">
              {stat.label}
            </Text>

            {/*  Value pops in after label */}
            <MotiView
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 14,
                delay: 500 + index * 80,
              }}
            >
              <Text className="text-xl font-black text-white tracking-tight">
                {stat.value}
              </Text>
            </MotiView>

            <Text className="text-[10px] font-bold text-[#4c4a7a] mb-1.5">
              {stat.unit}
            </Text>

            {/*  Progress bar grows after card appears */}
            <View className="w-full h-1 bg-[#2d2a6e] rounded-full overflow-hidden">
              <MotiView
                from={{ width: "0%" as `${number}%` }}
                animate={{ width: `${stat.progress}%` as `${number}%` }}
                transition={{
                  type: "timing",
                  duration: 700,
                  delay: 560 + index * 80,
                }}
                className="h-full bg-[#6366f1] rounded-full"
              />
            </View>
          </MotiView>
        ))}
      </View>
    </MotiView>
  );
}
