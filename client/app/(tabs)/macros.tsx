import { View, Text, ScrollView, Pressable } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { MotiView } from "moti";

import { fetchMacrosByDate } from "@/api/macros";
import LoadingOverlay from "@/components/LoadingOverplay";

/* ---------------- DATE HELPERS ---------------- */
const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const toKey = (date: Date) => date.toISOString().slice(0, 10);

/* ---------------- TYPES ---------------- */
export type MacroData = {
  id: number;
  date: string;

  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;

  saturated_fat: number;
  monounsaturated_fat: number;
  polyunsaturated_fat: number;
  trans_fat: number;

  cholesterol: number;
  sodium: number;

  vitamin_a: number;
  vitamin_c: number;
  vitamin_d: number;
  vitamin_e: number;
  vitamin_k: number;

  vitamin_b1: number;
  vitamin_b2: number;
  vitamin_b3: number;
  vitamin_b6: number;
  vitamin_b9: number;
  vitamin_b12: number;

  calcium: number;
  iron: number;
  magnesium: number;
  phosphorus: number;
  potassium: number;
  zinc: number;
  copper: number;
  manganese: number;
};
/* ---------------- UI FIELD MAP ---------------- */
const NUTRIENTS: {
  key: keyof MacroData;
  label: string;
  unit: string;
}[] = [
  { key: "protein", label: "Protein", unit: "g" },
  { key: "carbs", label: "Carbohydrates", unit: "g" },
  { key: "fats", label: "Total Fat", unit: "g" },
  { key: "fiber", label: "Dietary Fiber", unit: "g" },
  { key: "sugar", label: "Sugars", unit: "g" },

  { key: "saturated_fat", label: "Saturated Fat", unit: "g" },
  { key: "monounsaturated_fat", label: "Monounsaturated Fat", unit: "g" },
  { key: "polyunsaturated_fat", label: "Polyunsaturated Fat", unit: "g" },
  { key: "trans_fat", label: "Trans Fat", unit: "g" },

  { key: "cholesterol", label: "Cholesterol", unit: "mg" },
  { key: "sodium", label: "Sodium", unit: "mg" },

  { key: "vitamin_a", label: "Vitamin A", unit: "µg" },
  { key: "vitamin_c", label: "Vitamin C", unit: "mg" },
  { key: "vitamin_d", label: "Vitamin D", unit: "µg" },
  { key: "vitamin_e", label: "Vitamin E", unit: "mg" },
  { key: "vitamin_k", label: "Vitamin K", unit: "µg" },

  { key: "vitamin_b1", label: "Vitamin B1", unit: "mg" },
  { key: "vitamin_b2", label: "Vitamin B2", unit: "mg" },
  { key: "vitamin_b3", label: "Vitamin B3", unit: "mg" },
  { key: "vitamin_b6", label: "Vitamin B6", unit: "mg" },
  { key: "vitamin_b9", label: "Vitamin B9", unit: "µg" },
  { key: "vitamin_b12", label: "Vitamin B12", unit: "µg" },

  { key: "calcium", label: "Calcium", unit: "mg" },
  { key: "iron", label: "Iron", unit: "mg" },
  { key: "magnesium", label: "Magnesium", unit: "mg" },
  { key: "phosphorus", label: "Phosphorus", unit: "mg" },
  { key: "potassium", label: "Potassium", unit: "mg" },
  { key: "zinc", label: "Zinc", unit: "mg" },
  { key: "copper", label: "Copper", unit: "mg" },
  { key: "manganese", label: "Manganese", unit: "mg" },
];

/* ---------------- SCREEN ---------------- */
export default function NutritionScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dataByDate, setDataByDate] = useState<MacroData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goPrevDay = () =>
    setCurrentDate((d) => new Date(d.getTime() - 86400000));

  const goNextDay = () =>
    setCurrentDate((d) => new Date(d.getTime() + 86400000));

  const loadDataByDate = async () => {
    try {
      setLoading(true);
      setError(null);

      const macros = await fetchMacrosByDate(); // returns MacroData[]
      setDataByDate(macros);
    } catch {
      setError("Failed to load nutrition data");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDataByDate();
    }, []),
  );

  const dayKey = toKey(currentDate);
  const dayData = dataByDate.find((d) => d.date === dayKey);
  const toNumber = (value: string | number | undefined) =>
    typeof value === "number" ? value : Number(value) || 0;

  /* ---------- ERROR ---------- */
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
        className="px-6 pt-4"
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------- HEADER ---------- */}
        <View className="flex-row items-center justify-between mb-6">
          <Pressable
            onPress={goPrevDay}
            className="bg-white p-2.5 rounded-2xl border border-slate-100"
          >
            <Feather name="chevron-left" size={22} color="#0f172a" />
          </Pressable>

          <View className="items-center">
            <Text className="text-xs font-bold tracking-[2px] uppercase text-slate-400">
              Nutrition
            </Text>
            <Text className="text-xl font-black text-slate-900">
              {formatDate(currentDate)}
            </Text>
          </View>

          <Pressable
            onPress={goNextDay}
            className="bg-white p-2.5 rounded-2xl border border-slate-100"
          >
            <Feather name="chevron-right" size={22} color="#0f172a" />
          </Pressable>
        </View>

        {/* ---------- NO DATA ---------- */}
        {!loading && !dayData && (
          <View className="bg-white border border-slate-100 rounded-3xl p-6">
            <Text className="text-slate-400 font-semibold text-center">
              No nutrition data for this day
            </Text>
          </View>
        )}

        {/* ---------- NUTRIENTS ---------- */}
        {dayData && (
          <MotiView
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            className="bg-white rounded-3xl border border-slate-100 p-6"
          >
            <Text className="text-sm font-bold tracking-wide text-slate-400 mb-4">
              MACROS & MICRONUTRIENTS
            </Text>

            {NUTRIENTS.map((n) => (
              <View
                key={n.key}
                className="flex-row justify-between py-3 border-b border-slate-100 last:border-b-0"
              >
                <Text className="text-slate-700 font-semibold">{n.label}</Text>
                <Text className="text-slate-900 font-bold">
                  {Math.round(toNumber(dayData[n.key]))} {n.unit}
                </Text>
              </View>
            ))}
          </MotiView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
