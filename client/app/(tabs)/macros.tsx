import { View, Text, ScrollView } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";
import { fetchMacrosByDate } from "@/api/macros";
import LoadingOverlay from "@/components/LoadingOverplay";
import { MacroData } from "@/types/macros";

import NutritionHeader from "@/components/Nutrition/NutritionHeader";
import MacroCards from "@/components/Nutrition/MacroCard";
import MacroChart from "@/components/Nutrition/MacroChart";
import MicronutrientGrid from "@/components/Nutrition/MacronutrientGrid";

const toKey = (date: Date) => date.toISOString().slice(0, 10);

const emptyDay: MacroData = {
  id: 0,
  date: "",
  calories: 0,
  protein: 0,
  carbs: 0,
  fats: 0,
  fiber: 0,
  sugar: 0,
  saturated_fat: 0,
  monounsaturated_fat: 0,
  polyunsaturated_fat: 0,
  trans_fat: 0,
  cholesterol: 0,
  sodium: 0,
  vitamin_a: 0,
  vitamin_c: 0,
  vitamin_d: 0,
  vitamin_e: 0,
  vitamin_k: 0,
  vitamin_b1: 0,
  vitamin_b2: 0,
  vitamin_b3: 0,
  vitamin_b6: 0,
  vitamin_b9: 0,
  vitamin_b12: 0,
  calcium: 0,
  iron: 0,
  magnesium: 0,
  phosphorus: 0,
  potassium: 0,
  zinc: 0,
  copper: 0,
  manganese: 0,
};

export default function NutritionScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dataByDate, setDataByDate] = useState<MacroData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const goPrevDay = () => {
    setDirection("left");
    setCurrentDate((d) => new Date(d.getTime() - 86400000));
  };

  const goNextDay = () => {
    setDirection("right");
    setCurrentDate((d) => new Date(d.getTime() + 86400000));
  };

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          setLoading(true);
          setError(null);
          const macros = await fetchMacrosByDate();
          setDataByDate(macros);
        } catch {
          setError("Failed to load nutrition data");
        } finally {
          setLoading(false);
        }
      };
      load();
    }, []),
  );

  const dayKey = toKey(currentDate);
  const dayData =
    dataByDate.find((d) => d.date === toKey(currentDate)) ?? emptyDay;

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-neutral-50">
        <Text className="text-neutral-500 text-sm">{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {loading && <LoadingOverlay text="Loading nutrition..." />}

      <ScrollView
        className="px-4 pt-2"
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <NutritionHeader
          currentDate={currentDate}
          onPrev={goPrevDay}
          onNext={goNextDay}
        />

        {!loading && !dayData && (
          <View className="bg-white border border-slate-100 rounded-3xl p-6">
            <Text className="text-slate-400 font-semibold text-center">
              No nutrition data for this day
            </Text>
          </View>
        )}

        {dayData && (
          <MotiView
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            className="bg-white rounded-[32px] border border-slate-100 p-5 shadow-sm mb-6"
          >
            <Text
              className="text-xs font-bold text-slate-400 mb-4"
              style={{ letterSpacing: 1.5 }}
            >
              DAILY MACROS
            </Text>

            <MacroCards
              key={`cards-${dayKey}`}
              protein={dayData.protein}
              carbs={dayData.carbs}
              fats={dayData.fats}
              direction={direction}
            />

            <MacroChart
              key={`chart-${dayKey}`}
              protein={dayData.protein}
              carbs={dayData.carbs}
              fats={dayData.fats}
              direction={direction}
            />

            <MicronutrientGrid dayData={dayData} />
          </MotiView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
