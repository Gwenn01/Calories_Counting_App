// components/CaloriesCard.tsx
import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MotiView } from "moti";

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
    //  Card slides up + fades on mount
    <MotiView
      from={{ opacity: 0, translateY: 24, scale: 0.97 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
      className="bg-slate-900 rounded-[36px] p-6 mb-6"
    >
      {/* Top: Calories */}
      <View className="flex-row justify-between items-start mb-5">
        <View>
          {/*  Label fades in first */}
          <MotiView
            from={{ opacity: 0, translateX: -12 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: "timing", duration: 350, delay: 100 }}
          >
            <Text className="text-emerald-400 font-bold text-xs uppercase mb-1.5 tracking-widest">
              Calories Consumed
            </Text>
          </MotiView>

          {/*  Number pops in with spring */}
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
            <View className="flex-row items-baseline gap-1">
              <Text className="text-5xl font-black text-white tracking-tighter">
                {currentCalories}
              </Text>
              <Text className="text-base font-medium text-slate-500">
                / {caloriesGoal}
              </Text>
            </View>
          </MotiView>
        </View>

        {/*  Icon bounces in */}
        <MotiView
          from={{ opacity: 0, scale: 0.4, rotate: "-30deg" }}
          animate={{ opacity: 1, scale: 1, rotate: "0deg" }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 14,
            delay: 200,
          }}
          className="bg-slate-800 h-11 w-11 rounded-full items-center justify-center border border-slate-700"
        >
          <Feather name="zap" size={20} color="#34d399" />
        </MotiView>
      </View>

      {/*  Calorie progress bar grows from 0 */}
      <View className="h-2 bg-slate-800 rounded-full overflow-hidden mb-1.5">
        <MotiView
          from={{ width: "0%" as `${number}%` }}
          animate={{ width: `${calorieProgress}%` as `${number}%` }}
          transition={{ type: "timing", duration: 800, delay: 300 }}
          className="h-full bg-emerald-500 rounded-full"
        />
      </View>

      {/*  Remaining text fades in after bar */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "timing", duration: 300, delay: 500 }}
      >
        <Text className="text-slate-400 text-xs font-medium mb-5">
          <Text className="text-white font-bold">{caloriesRemaining}</Text> kcal
          remaining
        </Text>
      </MotiView>

      {/*  Divider slides in */}
      <MotiView
        from={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ type: "timing", duration: 400, delay: 350 }}
        style={{ transformOrigin: "left" }}
        className="h-px bg-slate-800 mb-5"
      />

      {/* Macros */}
      <View className="flex-row gap-3">
        {macros.map((macro, index) => {
          const progress = Math.min((macro.value / macro.goal) * 100 || 0, 100);
          return (
            //  Each macro staggered fade + slide up
            <MotiView
              key={macro.label}
              from={{ opacity: 0, translateY: 14 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 16,
                delay: 420 + index * 80, // stagger: 420, 500, 580ms
              }}
              className="flex-1"
            >
              <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                {macro.label}
              </Text>

              <View className="flex-row items-baseline gap-0.5 mb-1.5">
                {/*  Value pops after label */}
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
                  <Text className="text-xl font-black text-white">
                    {macro.value}
                  </Text>
                </MotiView>
                <Text className="text-[10px] text-slate-500 font-bold">
                  /{macro.goal}
                  {macro.unit}
                </Text>
              </View>

              {/*  Macro progress bar grows after card appears */}
              <View
                className={`w-full h-1 ${macro.track} rounded-full overflow-hidden opacity-40`}
              >
                <MotiView
                  from={{ width: "0%" as `${number}%` }}
                  animate={{ width: `${progress}%` as `${number}%` }}
                  transition={{
                    type: "timing",
                    duration: 700,
                    delay: 560 + index * 80,
                  }}
                  className={`h-full ${macro.bg} rounded-full`}
                />
              </View>
            </MotiView>
          );
        })}
      </View>
    </MotiView>
  );
}
