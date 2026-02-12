import React, { useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { fetchTodayOverview } from "@/api/overview";
import LoadingOverlay from "@/components/LoadingOverplay";
import { PieChart } from "react-native-gifted-charts";

export default function TodayScreen() {
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  /* ---------- DATA PREP ---------- */
  const calorieProgress =
    (overview.current_calories / overview.calories_goal) * 100 || 0;

  // 2. Prepare Chart Data (Convert grams to calories for accuracy)
  const proteinCal = (overview.current_protein || 0) * 4;
  const carbsCal = (overview.current_carbs || 0) * 4;
  const fatsCal = (overview.current_fats || 0) * 9;
  const totalLogged = proteinCal + carbsCal + fatsCal || 1; // Prevent divide by zero

  const pieData = [
    { value: proteinCal, color: "#6366f1", text: "" }, // Indigo
    { value: carbsCal, color: "#0ea5e9", text: "" }, // Sky
    { value: fatsCal, color: "#f43f5e", text: "" }, // Rose
  ];

  // If no food logged yet, show a grey placeholder ring
  const isEmpty = totalLogged === 1;
  const displayData = isEmpty ? [{ value: 100, color: "#e2e8f0" }] : pieData;

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
      {loading && <LoadingOverlay text="Loading nutrition..." />}
      <ScrollView
        className="flex-1 px-5 pt-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6 mt-2">
          {/* Left: Title */}
          <View>
            <Text className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Summary
            </Text>
            <Text className="text-3xl font-black text-neutral-900">Today</Text>
          </View>

          {/* Right: Logo + Calendar */}
          <View className="flex-row items-center gap-3">
            {/* App Logo
            <View className="bg-white p-2 rounded-full border border-neutral-100 shadow-sm">
              <Image
                source={require("@/assets/image/logo.jpg")}
                className="w-7 h-7"
                resizeMode="contain"
              />
            </View>
              */}
            {/* Calendar Button */}
            <View className="bg-white p-3 rounded-full border border-neutral-100 shadow-sm">
              <Feather name="calendar" size={20} color="#525252" />
            </View>
          </View>
        </View>

        {/* Calories Card */}
        <View className="bg-slate-900 rounded-[36px] p-7 mb-6 shadow-xl shadow-slate-300/40">
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="text-emerald-400 font-bold text-xs uppercase mb-2 tracking-widest">
                Calories Consumed
              </Text>
              <View className="flex-row items-baseline">
                <Text className="text-6xl font-black text-white tracking-tighter">
                  {overview.current_calories}
                </Text>
                <Text className="text-lg font-medium text-slate-500 ml-2">
                  / {overview.calories_goal}
                </Text>
              </View>
            </View>
            <View className="bg-slate-800 h-12 w-12 rounded-full items-center justify-center border border-slate-700">
              <Feather name="zap" size={24} color="#34d399" />
            </View>
          </View>

          <View className="mt-6">
            <View className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
              <View
                className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                style={{ width: `${calorieProgress}%` }}
              />
            </View>
            <Text className="mt-4 text-center text-slate-400 text-sm font-medium">
              <Text className="text-white font-bold">
                {overview.calories_remaining}
              </Text>{" "}
              kcal remaining
            </Text>
          </View>
        </View>

        {/* Macros Grid */}
        <Text className="text-lg font-bold text-neutral-800 mb-4 tracking-tight">
          Macronutrients
        </Text>

        <View className="flex-row gap-3 mb-8">
          {macros.map((macro) => {
            const progress = (macro.value / macro.goal) * 100 || 0;

            return (
              <View
                key={macro.label}
                className="flex-1 bg-white p-4 rounded-[24px] border border-neutral-100 shadow-sm"
              >
                <Text className="text-[10px] font-bold text-neutral-400 uppercase mb-2 tracking-wide">
                  {macro.label}
                </Text>

                <View className="mb-2">
                  <Text className="text-2xl font-black text-neutral-800 tracking-tighter">
                    {macro.value}
                  </Text>
                  <Text className="text-[10px] text-neutral-400 font-bold">
                    / {macro.goal}
                    {macro.unit}
                  </Text>
                </View>

                <View
                  className={`w-full h-1.5 ${macro.track} rounded-full overflow-hidden`}
                >
                  <View
                    className={`h-full ${macro.bg}`}
                    style={{ width: `${progress}%` }}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* --- 3. NEW CHART SECTION --- */}
        <View className="bg-white rounded-[28px] p-6 mb-6 border border-slate-100 shadow-sm">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-lg font-bold text-slate-800">
              Macro Split
            </Text>
            {/* Optional Badge */}
            <View className="bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
              <Text className="text-[10px] font-bold text-slate-400 uppercase">
                Ratio
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-center">
            {/* The Ring Chart */}
            <View className="items-center justify-center relative">
              <PieChart
                data={displayData}
                donut
                radius={60}
                innerRadius={45}
                showText={false}
                sectionAutoFocus
              />
              {/* Icon in middle of donut */}
              <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center pointer-events-none">
                <Feather
                  name="pie-chart"
                  size={20}
                  color={isEmpty ? "#cbd5e1" : "#64748b"}
                />
              </View>
            </View>

            {/* Legend */}
            <View className="ml-8 justify-center space-y-3">
              {macros.map((m, i) => {
                // Calculate percentage for legend
                // We use the 'pieData' array specifically to match the cal logic
                const currentVal = pieData[i].value;
                const percentage = isEmpty
                  ? 0
                  : Math.round((currentVal / totalLogged) * 100);

                return (
                  <View key={i} className="flex-row items-center">
                    <View
                      style={{ backgroundColor: m.color }}
                      className="w-3 h-3 rounded-full mr-2"
                    />
                    <View>
                      <Text className="text-xs text-slate-400 font-bold uppercase">
                        {m.label}
                      </Text>
                      <Text className="text-sm font-bold text-slate-700">
                        {percentage}%
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
        {/* --- END CHART SECTION --- */}
      </ScrollView>
    </SafeAreaView>
  );
}
