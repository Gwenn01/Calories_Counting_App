import { View, Text, ScrollView, Pressable } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { MotiView } from "moti";
import { fetchMacrosByDate } from "@/api/macros";
import LoadingOverlay from "@/components/LoadingOverplay";
import { NUTRIENTS } from "@/constants/nutrients";
import { MacroData } from "@/types/macros";
import { PieChart } from "react-native-gifted-charts";

/* ---------------- DATE HELPERS ---------------- */
const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const toKey = (date: Date) => date.toISOString().slice(0, 10);

// data icon
// Map each nutrient key to an icon + accent color
const NUTRIENT_META: Record<
  string,
  { icon: string; color: string; bg: string; border: string }
> = {
  vitamin_c: {
    icon: "sun",
    color: "#38bdf8",
    bg: "#0c2a4a",
    border: "#1e3a5f",
  },
  vitamin_a: {
    icon: "eye",
    color: "#fbbf24",
    bg: "#2e1f0a",
    border: "#3a2a1e",
  },
  vitamin_d: {
    icon: "sun",
    color: "#fde68a",
    bg: "#2e280a",
    border: "#3a341e",
  },
  vitamin_e: {
    icon: "shield",
    color: "#4ade80",
    bg: "#0a2e1a",
    border: "#1e3a2d",
  },
  vitamin_k: {
    icon: "shield",
    color: "#a78bfa",
    bg: "#1a0a2e",
    border: "#2a1e3a",
  },
  vitamin_b1: {
    icon: "zap",
    color: "#fb923c",
    bg: "#2e1a0a",
    border: "#3a2a1e",
  },
  vitamin_b2: {
    icon: "zap",
    color: "#fb923c",
    bg: "#2e1a0a",
    border: "#3a2a1e",
  },
  vitamin_b3: {
    icon: "zap",
    color: "#fb923c",
    bg: "#2e1a0a",
    border: "#3a2a1e",
  },
  vitamin_b6: {
    icon: "zap",
    color: "#fb923c",
    bg: "#2e1a0a",
    border: "#3a2a1e",
  },
  vitamin_b9: {
    icon: "zap",
    color: "#fb923c",
    bg: "#2e1a0a",
    border: "#3a2a1e",
  },
  vitamin_b12: {
    icon: "zap",
    color: "#fb923c",
    bg: "#2e1a0a",
    border: "#3a2a1e",
  },
  calcium: {
    icon: "shield",
    color: "#4ade80",
    bg: "#1a2e0a",
    border: "#2d3a1e",
  },
  iron: {
    icon: "activity",
    color: "#fb923c",
    bg: "#2e1a0a",
    border: "#3a2a1e",
  },
  magnesium: {
    icon: "zap",
    color: "#a78bfa",
    bg: "#1a0a2e",
    border: "#2a1e3a",
  },
  phosphorus: {
    icon: "circle",
    color: "#38bdf8",
    bg: "#0c2a4a",
    border: "#1e3a5f",
  },
  potassium: {
    icon: "shield",
    color: "#34d399",
    bg: "#0a2e1a",
    border: "#1e3a2d",
  },
  zinc: { icon: "cpu", color: "#818cf8", bg: "#0f172a", border: "#1e2a5f" },
  copper: { icon: "cpu", color: "#f97316", bg: "#2e1a0a", border: "#3a2a1e" },
  manganese: {
    icon: "cpu",
    color: "#e879f9",
    bg: "#2a0a2e",
    border: "#3a1e3a",
  },
  sodium: { icon: "heart", color: "#f87171", bg: "#2e0a0a", border: "#3a1e1e" },
  cholesterol: {
    icon: "heart",
    color: "#f43f5e",
    bg: "#2e0a14",
    border: "#3a1e24",
  },
  fiber: { icon: "layers", color: "#86efac", bg: "#0a2e14", border: "#1e3a24" },
  sugar: {
    icon: "droplet",
    color: "#fca5a5",
    bg: "#2e0a0a",
    border: "#3a1e1e",
  },
};

const FALLBACK_META = {
  icon: "circle",
  color: "#64748b",
  bg: "#1e293b",
  border: "#334155",
};

/* ---------------- SCREEN ---------------- */
export default function NutritionScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dataByDate, setDataByDate] = useState<MacroData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isCurrentDay = currentDate.toDateString() === new Date().toDateString();

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
  // day data ============================================
  const dayKey = toKey(currentDate);
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
  const dayData: MacroData =
    dataByDate.find((d) => d.date === dayKey) ?? emptyDay;
  const toNumber = (value: string | number | undefined) =>
    typeof value === "number" ? value : Number(value) || 0;

  const getNutrient = (key: string): number => {
    const val = (dayData as Record<string, unknown>)[key];
    return typeof val === "number" ? val : Number(val) || 0;
  };

  // pi chart data =================================================================
  const proteinCal = (dayData.protein || 0) * 4;
  const carbsCal = (dayData.carbs || 0) * 4;
  const fatsCal = (dayData.fats || 0) * 9;
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
      value: dayData.protein,
      //goal: dayData.protein_goal,
      unit: "g",
      color: "#6366f1", // Hex for chart legend
      bg: "bg-indigo-500", // Tailwind for Macro Card
      track: "bg-indigo-100",
    },
    {
      label: "Carbs",
      value: dayData.carbs,
      //goal: dayData.carbs_goal,
      unit: "g",
      color: "#0ea5e9",
      bg: "bg-sky-500",
      track: "bg-sky-100",
    },
    {
      label: "Fats",
      value: dayData.fats,
      //goal: dayData.fats_goal,
      unit: "g",
      color: "#f43f5e",
      bg: "bg-rose-500",
      track: "bg-rose-100",
    },
  ];

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
        className="px-4 pt-2"
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------- HEADER ---------- */}
        <View className="flex-row items-center justify-between mb-4 bg-white rounded-[20px] px-4 py-4 border border-slate-100">
          {/* Prev */}
          <Pressable
            onPress={goPrevDay}
            className="w-10 h-10 rounded-[14px] bg-slate-900 border border-slate-100 items-center justify-center"
          >
            <Feather name="chevron-left" size={18} color="#fff" />
          </Pressable>

          {/* Center */}
          <View className="flex-1 items-center px-3 gap-0.5">
            {/* Label + calendar icon */}
            <View className="flex-row items-center gap-1.5 mb-0.5">
              <Feather name="clipboard" size={11} color="#94a3b8" />
              <Text className="text-[10px] font-bold tracking-[2px] uppercase text-slate-400">
                Nutrition
              </Text>
            </View>

            {/* Day name */}
            <Text className="text-[11px] font-semibold text-slate-400">
              {currentDate.toLocaleDateString("en-US", { weekday: "long" })}
            </Text>

            {/* Full date */}
            <Text
              className="text-xl font-black text-slate-900"
              style={{ letterSpacing: -0.5 }}
            >
              {formatDate(currentDate)}
            </Text>

            {/* Today badge */}
            {isCurrentDay && (
              <View className="mt-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-0.5">
                <Text className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                  Today
                </Text>
              </View>
            )}
          </View>

          {/* Next */}
          <Pressable
            onPress={goNextDay}
            className="w-10 h-10 rounded-[14px] bg-slate-900 items-center justify-center"
          >
            <Feather name="chevron-right" size={18} color="#fff" />
          </Pressable>
        </View>

        {/*  NO DATA ======================================================= */}
        {!loading && !dayData && (
          <View className="bg-white border border-slate-100 rounded-3xl p-6">
            <Text className="text-slate-400 font-semibold text-center">
              No nutrition data for this day
            </Text>
          </View>
        )}

        {/* NUTRIENTS ========================================================= */}
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

            {/* --- HIGHLIGHTED MACROS (The Big 3) --- */}
            <View className="flex-row justify-between gap-3 mb-6">
              {/* Protein Card - Violet */}
              <View className="flex-1 bg-violet-50 rounded-2xl p-4 items-center border border-violet-100">
                <Feather
                  name="target"
                  size={20}
                  color="#7c3aed" // violet-600
                  className="mb-2"
                />
                <Text className="text-violet-900 font-black text-xl">
                  {Math.round(toNumber(dayData.protein))}g
                </Text>
                <Text className="text-violet-600 font-semibold text-[10px] uppercase mt-1">
                  Protein
                </Text>
              </View>

              {/* Carbs Card - Blue */}
              <View className="flex-1 bg-blue-50 rounded-2xl p-4 items-center border border-blue-100">
                <Feather
                  name="zap"
                  size={20}
                  color="#2563eb" // blue-600
                  className="mb-2"
                />
                <Text className="text-blue-900 font-black text-xl">
                  {Math.round(toNumber(dayData.carbs))}g
                </Text>
                <Text className="text-blue-600 font-semibold text-[10px] uppercase mt-1">
                  Carbs
                </Text>
              </View>

              {/* Fat Card - Red */}
              <View className="flex-1 bg-red-50 rounded-2xl p-4 items-center border border-red-100">
                <Feather
                  name="droplet"
                  size={20}
                  color="#dc2626" // red-600
                  className="mb-2"
                />
                <Text className="text-red-900 font-black text-xl">
                  {Math.round(toNumber(dayData.fats))}g
                </Text>
                <Text className="text-red-600 font-semibold text-[10px] uppercase mt-1">
                  Fat
                </Text>
              </View>
            </View>

            {/* CHART SECTION ============================================================*/}
            <View className="bg-white rounded-[24px] px-5 py-4 mb-6 border border-slate-100">
              <Text className="text-sm font-bold text-slate-800 mb-4">
                Macro Split
              </Text>

              <View className="flex-row items-center gap-4">
                {/* Donut */}
                <View className="items-center justify-center">
                  <PieChart
                    data={displayData}
                    donut
                    radius={46}
                    innerRadius={34}
                    showText={false}
                  />
                  <View className="absolute items-center justify-center">
                    <Feather
                      name="pie-chart"
                      size={14}
                      color={isEmpty ? "#cbd5e1" : "#64748b"}
                    />
                  </View>
                </View>

                {/* Macro pills */}
                <View className="flex-1 gap-2">
                  {macros.map((m, i) => {
                    const currentVal = pieData[i].value;
                    const percentage = isEmpty
                      ? 0
                      : Math.round((currentVal / totalLogged) * 100);

                    return (
                      <View
                        key={i}
                        className="flex-row items-center justify-between"
                      >
                        {/* Left: dot + label */}
                        <View className="flex-row items-center gap-2">
                          <View
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: m.color }}
                          />
                          <Text className="text-xs text-slate-500 font-semibold">
                            {m.label}
                          </Text>
                        </View>
                        {/* Right: value + percent badge */}
                        <View className="flex-row items-center gap-2">
                          <Text className="text-xs text-slate-400">
                            {toNumber(m.value)}g
                          </Text>
                          {/* Percent badge */}
                          <View
                            className="px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: m.color + "20" }} // 12% opacity
                          >
                            <Text
                              className="text-[11px] font-bold"
                              style={{ color: m.color }}
                            >
                              {percentage}%
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* --- MICRONUTRIENTS LIST ======================================================== */}
            {/* MICRONUTRIENTS */}
            <Text
              className="text-xs font-bold text-slate-500 mb-3"
              style={{ letterSpacing: 1.5 }}
            >
              MICRONUTRIENTS
            </Text>

            <View className="flex-row flex-wrap gap-1">
              {NUTRIENTS.filter(
                (n) =>
                  !["protein", "carbs", "fat"].includes(n.key.toLowerCase()),
              ).map((n) => {
                const meta = NUTRIENT_META[n.key] ?? FALLBACK_META;
                const value = Math.round(getNutrient(n.key));

                return (
                  <View
                    key={n.key}
                    className="rounded-[16px] bg-slate-900  p-3"
                    style={{
                      borderWidth: 0.5,
                      borderColor: meta.border,
                      width: "48%", // 2 columns
                    }}
                  >
                    {/* Icon + label row */}
                    <View className="flex-row items-center gap-2 mb-2">
                      <View
                        className="w-6 h-6 rounded-[8px] items-center justify-center"
                        style={{ backgroundColor: meta.bg }}
                      >
                        <Feather
                          name={meta.icon as any}
                          size={12}
                          color={meta.color}
                        />
                      </View>
                      <Text
                        className="text-[5px] font-bold text-slate-500 uppercase"
                        style={{ letterSpacing: 1 }}
                        numberOfLines={1}
                      >
                        {n.label}
                      </Text>
                    </View>

                    {/* Value */}
                    <View className="flex-row items-baseline gap-1">
                      <Text
                        className="text-xl font-black text-white"
                        style={{ letterSpacing: -0.5 }}
                      >
                        {value}
                      </Text>
                      <Text className="text-[10px] font-semibold text-slate-600">
                        {n.unit}
                      </Text>
                    </View>

                    {/* Mini progress bar */}
                    <View className="h-0.5 bg-slate-900 rounded-full overflow-hidden mt-2">
                      <View
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: meta.color,
                          width: `${Math.min((value / 100) * 100, 100)}%`,
                        }}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </MotiView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
