import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { MotiView } from "moti";
import { useState } from "react";

/* ---------------- DATE HELPERS ---------------- */
const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const toKey = (date: Date) => date.toISOString().slice(0, 10);

/* ---------------- TYPES ---------------- */
type ConsumedNutrition = {
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

type DayNutrition = {
  date: string;
  consumed: ConsumedNutrition;
  targets: {
    calories: number;
  };
};

/* ---------------- SAMPLE BACKEND DATA (ARRAY) ---------------- */
const DATA_BY_DATE: DayNutrition[] = [
  {
    date: "2026-02-02",
    consumed: {
      calories: 1650,
      protein: 120,
      carbs: 180,
      fats: 55,
      fiber: 28,
      sugar: 42,

      saturated_fat: 18,
      monounsaturated_fat: 20,
      polyunsaturated_fat: 12,
      trans_fat: 0,

      cholesterol: 220,
      sodium: 1900,

      vitamin_a: 900,
      vitamin_c: 75,
      vitamin_e: 12,
      vitamin_k: 110,
      vitamin_b1: 1.2,
      vitamin_b2: 1.4,
      vitamin_b3: 16,
      vitamin_b6: 1.6,
      vitamin_b9: 400,
      vitamin_b12: 2.4,

      calcium: 950,
      iron: 14,
      magnesium: 380,
      phosphorus: 700,
      potassium: 3400,
      zinc: 11,
      copper: 0.9,
      manganese: 2.3,
    },
    targets: {
      calories: 2000,
    },
  },
];

/* ---------------- UI FIELD MAP ---------------- */
const NUTRIENTS: {
  key: keyof ConsumedNutrition;
  label: string;
  unit: string;
}[] = [
  /* ---------- MACROS ---------- */
  { key: "protein", label: "Protein", unit: "g" },
  { key: "carbs", label: "Carbohydrates", unit: "g" },
  { key: "fats", label: "Total Fat", unit: "g" },
  { key: "fiber", label: "Dietary Fiber", unit: "g" },
  { key: "sugar", label: "Sugars", unit: "g" },

  /* ---------- FAT BREAKDOWN ---------- */
  { key: "saturated_fat", label: "Saturated Fat", unit: "g" },
  { key: "monounsaturated_fat", label: "Monounsaturated Fat", unit: "g" },
  { key: "polyunsaturated_fat", label: "Polyunsaturated Fat", unit: "g" },
  { key: "trans_fat", label: "Trans Fat", unit: "g" },

  /* ---------- CHOLESTEROL & SODIUM ---------- */
  { key: "cholesterol", label: "Cholesterol", unit: "mg" },
  { key: "sodium", label: "Sodium", unit: "mg" },

  /* ---------- VITAMINS ---------- */
  { key: "vitamin_a", label: "Vitamin A", unit: "µg" },
  { key: "vitamin_c", label: "Vitamin C", unit: "mg" },
  { key: "vitamin_e", label: "Vitamin E", unit: "mg" },
  { key: "vitamin_k", label: "Vitamin K", unit: "µg" },

  { key: "vitamin_b1", label: "Vitamin B1 (Thiamine)", unit: "mg" },
  { key: "vitamin_b2", label: "Vitamin B2 (Riboflavin)", unit: "mg" },
  { key: "vitamin_b3", label: "Vitamin B3 (Niacin)", unit: "mg" },
  { key: "vitamin_b6", label: "Vitamin B6", unit: "mg" },
  { key: "vitamin_b9", label: "Vitamin B9 (Folate)", unit: "µg" },
  { key: "vitamin_b12", label: "Vitamin B12", unit: "µg" },

  /* ---------- MINERALS ---------- */
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

  const goPrevDay = () =>
    setCurrentDate((d) => new Date(d.getTime() - 86400000));

  const goNextDay = () =>
    setCurrentDate((d) => new Date(d.getTime() + 86400000));

  const key = toKey(currentDate);

  const dayData = DATA_BY_DATE.find((d) => d.date === key);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
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

        {/* ---------- NO DATA STATE ---------- */}
        {!dayData && (
          <View className="bg-white border border-slate-100 rounded-3xl p-6 mb-8">
            <Text className="text-slate-400 font-semibold text-center">
              No nutrition data for this day
            </Text>
          </View>
        )}

        {/* ---------- ENERGY CARD ---------- */}
        {dayData && (
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-[36px] p-7 mb-8"
          >
            <View className="flex-row justify-between">
              <View>
                <Text className="text-xs font-bold tracking-[2px] uppercase text-emerald-400 mb-2">
                  Energy
                </Text>

                <View className="flex-row items-baseline">
                  <Text className="text-[56px] font-black text-white">
                    {dayData.consumed.calories}
                  </Text>
                  <Text className="text-lg font-bold text-slate-500 ml-2">
                    kcal
                  </Text>
                </View>

                <Text className="text-sm text-slate-400 mt-1">
                  of {dayData.targets.calories} target
                </Text>
              </View>

              <View className="bg-slate-800 p-3 rounded-2xl">
                <Feather name="zap" size={24} color="#10b981" />
              </View>
            </View>

            <View className="h-2 bg-slate-800 rounded-full mt-7 overflow-hidden">
              <View
                className="h-full bg-emerald-500 rounded-full"
                style={{
                  width: `${
                    (dayData.consumed.calories / dayData.targets.calories) * 100
                  }%`,
                }}
              />
            </View>
          </MotiView>
        )}

        {/* ---------- NUTRIENTS LIST ---------- */}
        {dayData && (
          <View className="bg-white rounded-3xl border border-slate-100 p-6">
            <Text className="text-sm font-bold tracking-wide text-slate-400 mb-4">
              DAILY NUTRIENTS
            </Text>

            {NUTRIENTS.map((n) => (
              <View
                key={n.key}
                className="flex-row justify-between py-3 border-b border-slate-100 last:border-b-0"
              >
                <Text className="text-slate-700 font-semibold">{n.label}</Text>
                <Text className="text-slate-900 font-bold">
                  {dayData.consumed[n.key] ?? 0} {n.unit}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
