import React, { useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { fetchTodayOverview } from "@/api/overview";
import LoadingOverlay from "@/components/LoadingOverplay";
// components
import { CaloriesCard } from "@/components/Overview/CaloriesCard";
import { StepsCard } from "@/components/Overview/StepCard";
import { SleepCard } from "@/components/Overview/SleepCard";

export default function TodayScreen() {
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // header data =====================================
  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  // functions ===========================================
  const loadOverview = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchTodayOverview();
      setOverview(data);
    } catch {
      setError("Failed to load overview");
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      loadOverview();
    }, []),
  );

  /* ---------- ERROR ---------- */
  if (error || !overview) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-neutral-50">
        <Text className="text-neutral-500 text-sm">
          Something went wrong. Please try again.
        </Text>
      </SafeAreaView>
    );
  }

  // calories data ===================================
  const currentCalories = overview.current_calories || 0;
  const caloriesGoal = overview.calories_goal || 0;
  const caloriesRemaining = overview.calories_remaining || 0;
  const macros = [
    {
      label: "Protein",
      value: overview.current_protein,
      goal: overview.protein_goal,
      unit: "g",
      color: "#6366f1", // Hex for chart legend
      bg: "bg-indigo-500", // Tailwind for Macro Card
      track: "bg-indigo-100",
    },
    {
      label: "Carbs",
      value: overview.current_carbs,
      goal: overview.carbs_goal,
      unit: "g",
      color: "#0ea5e9",
      bg: "bg-sky-500",
      track: "bg-sky-100",
    },
    {
      label: "Fats",
      value: overview.current_fats,
      goal: overview.fats_goal,
      unit: "g",
      color: "#f43f5e",
      bg: "bg-rose-500",
      track: "bg-rose-100",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <StatusBar style="dark" />
      {loading && <LoadingOverlay text="Loading nutrition..." />}
      <ScrollView
        className="flex-1 px-5 pt-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header ================================================================ */}
        <View className="flex-row justify-between items-center pt-1 pb-2">
          {/* Left: Logo + Title Block */}
          <View className="flex-row items-center gap-3">
            {/* Logo */}
            <Image
              source={require("@/assets/image/logo.jpg")}
              className="w-10 h-10"
              resizeMode="contain"
            />

            {/* Title */}
            <View className="items-start">
              <Text
                className="text-[10px] font-semibold text-neutral-400 uppercase"
                style={{ letterSpacing: 2 }}
              >
                TODAY {dateStr}
              </Text>
              <View className="flex-row items-center gap-1.5">
                <Text
                  className="text-2xl font-black text-neutral-900"
                  style={{ letterSpacing: -0.5 }}
                >
                  {dayName}
                </Text>
                <View className="w-2 h-2 rounded-full bg-emerald-400 mb-0.5" />
              </View>
            </View>
          </View>

          {/* Right: Schedule button */}
          <TouchableOpacity activeOpacity={0.8}>
            <LinearGradient
              colors={["#18181b", "#3f3f46"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="flex-row items-center gap-1 px-4 h-11 rounded-2xl"
              style={{
                shadowColor: "#18181b",
                shadowOpacity: 0.25,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 4 },
              }}
            >
              <Feather name="calendar" size={16} color="#fff" />
              <Text className="text-white text-sm font-semibold">Schedule</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        {/* MODAL ============================================ */}
        {/* CALORIES */}
        <CaloriesCard
          currentCalories={currentCalories}
          caloriesGoal={caloriesGoal}
          caloriesRemaining={caloriesRemaining}
          macros={macros}
        />
        {/* STEP */}
        <StepsCard
          currentSteps={7340}
          stepsGoal={10000}
          stats={[
            { label: "Distance", value: "5.4", unit: "km", progress: 73 },
            { label: "Calories", value: "312", unit: "kcal", progress: 60 },
            { label: "Active", value: "48", unit: "min", progress: 80 },
          ]}
        />
        {/* SLEEP */}
        <SleepCard
          lastNight={{
            total: { label: "Total", value: "7h 24m", progress: 77 },
            deep: { label: "Deep", value: "2h 10m", progress: 45 },
            rem: { label: "REM", value: "1h 48m", progress: 38 },
          }}
          bedtime="10:30 PM"
          wakeTime="6:02 AM"
          onSessionEnd={(seconds) =>
            console.log("Slept for", seconds, "seconds")
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}
