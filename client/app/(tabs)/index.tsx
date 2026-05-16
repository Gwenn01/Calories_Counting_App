import React, { useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Text, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
// api
import { fetchTodayOverview, fetchWorkoutOverview } from "@/api/overview";
// components
import LoadingOverlay from "@/components/LoadingOverplay";
import { CaloriesCard } from "@/components/Overview/CaloriesCard";
import HomeHeader from "@/components/Overview/HomeHeader";
import { WorkoutCard } from "@/components/Overview/WorkoutCard";
import { StepsCard } from "@/components/Overview/StepCard";
import { SleepCard } from "@/components/Overview/SleepCard";

// formatter
function formatVolume(vol: number): string {
  if (vol >= 1000) return `${(vol / 1000).toFixed(1)}k`;
  return vol.toString();
}

export default function TodayScreen() {
  const [overview, setOverview] = useState<any>(null);
  const [workoutSummary, setWorkoutSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [keyCal, setKeyCal] = useState(0);
  const [keyWorkout, setKeyWorkout] = useState(0);

  // header data
  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  // load the data from backend and handle loading and error states
  const loadAll = async () => {
    setError(null);
    setLoading(true);
    try {
      const [overviewData, workoutData] = await Promise.all([
        fetchTodayOverview(),
        fetchWorkoutOverview(),
      ]);
      setOverview(overviewData);
      setWorkoutSummary(workoutData);
      // Both keys update in the same event loop tick → single re-render
      setKeyCal((c) => c + 1);
      setKeyWorkout((c) => c + 1);
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAll();
    }, []),
  );

  if (error || !overview) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-neutral-50">
        <Text className="text-neutral-500 text-sm">
          Something went wrong. Please try again.
        </Text>
      </SafeAreaView>
    );
  }

  // ── Calories data ──────────────────────────────────────────
  const currentCalories = overview.current_calories || 0;
  const caloriesGoal = overview.calories_goal || 0;
  const caloriesRemaining = overview.calories_remaining || 0;
  const macros = [
    {
      label: "Protein",
      value: overview.current_protein,
      goal: overview.protein_goal,
      unit: "g",
      color: "#6366f1",
      bg: "bg-indigo-500",
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

  // ── Workout data ───────────────────────────────────────────
  const workoutProps = workoutSummary
    ? (() => {
        const durationProgress = Math.min(
          (workoutSummary.total_duration_minutes / 60) * 100,
          100,
        );
        const volumeProgress = Math.min(
          (workoutSummary.total_volume / 5000) * 100,
          100,
        );
        const energyProgress = (workoutSummary.average_energy / 10) * 100;
        const moodProgress = (workoutSummary.average_mood / 10) * 100;
        const calProgress = Math.min(
          (workoutSummary.calories_burned / 300) * 100,
          100,
        );

        const subStats = [
          {
            label: "Sets",
            value: workoutSummary.total_sets.toString(),
            unit: "sets done",
            progress: Math.min((workoutSummary.total_sets / 20) * 100, 100),
            color: "#38bdf8",
          },
          {
            label: "Reps",
            value: workoutSummary.total_reps.toString(),
            unit: "total reps",
            progress: Math.min((workoutSummary.total_reps / 100) * 100, 100),
            color: "#a78bfa",
          },
          {
            label: "Volume",
            value: formatVolume(workoutSummary.total_volume),
            unit: "kg lifted",
            progress: volumeProgress,
            color: "#34d399",
          },
          {
            label: "Calories",
            value: workoutSummary.calories_burned.toFixed(0),
            unit: "kcal burned",
            progress: calProgress,
            color: "#fb923c",
          },
        ];

        return {
          date: workoutSummary.date,
          totalWorkouts: workoutSummary.total_workouts,
          durationMinutes: workoutSummary.total_duration_minutes,
          prCount: workoutSummary.pr_count,
          durationProgress,
          subStats,
          energyValue: workoutSummary.average_energy,
          energyProgress,
          moodValue: workoutSummary.average_mood,
          moodProgress,
        };
      })()
    : null;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50">
        <LoadingOverlay text="Loading overview..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <StatusBar style="dark" />
      <ScrollView
        className="flex-1 px-5 pt-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <HomeHeader dateStr={dateStr} dayName={dayName} />

        {/* CALORIES */}
        <CaloriesCard
          key={`cal-${keyCal}`}
          currentCalories={currentCalories}
          caloriesGoal={caloriesGoal}
          caloriesRemaining={caloriesRemaining}
          macros={macros}
        />

        {/* WORKOUT */}
        {workoutProps && (
          <WorkoutCard
            key={`workout-${keyWorkout}`}
            date={workoutProps.date}
            totalWorkouts={workoutProps.totalWorkouts}
            durationMinutes={workoutProps.durationMinutes}
            prCount={workoutProps.prCount}
            durationProgress={workoutProps.durationProgress}
            subStats={workoutProps.subStats}
            energyValue={workoutProps.energyValue}
            energyProgress={workoutProps.energyProgress}
            moodValue={workoutProps.moodValue}
            moodProgress={workoutProps.moodProgress}
          />
        )}

        {/* STEPS (commented out) */}
        {/* <StepsCard ... /> */}

        {/* SLEEP (commented out) */}
        {/* <SleepCard ... /> */}
      </ScrollView>
    </SafeAreaView>
  );
}
