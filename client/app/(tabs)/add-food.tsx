import { useState, useEffect, useCallback, useMemo, memo, useRef } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import type { FoodItem } from "@/types/foods";
import type { MacroData } from "@/types/macros";

// components — food log
import LoadingOverlay from "@/components/LoadingOverplay";
import { useToast } from "@/components/ToastProvider";
import { FoodPickerModal } from "@/components/AddFood/FoodPickerModal";
import FoodDetailModal from "@/components/AddFood/FoodDetailModal";
import DeleteFoodModal from "@/components/AddFood/DeleteFoodModal";
import FoodRow from "@/components/AddFood/FoodRow";
import MealCard from "@/components/AddFood/MealCard";
import LogHeader from "@/components/AddFood/LogHeader";
import DailySummaryCard from "@/components/AddFood/DailySummaryCard";

// components — nutrition
import MacroCards from "@/components/Nutrition/MacroCard";
import MacroChart from "@/components/Nutrition/MacroChart";
import MicronutrientGrid from "@/components/Nutrition/MacronutrientGrid";

// apis
import {
  createLogs,
  getLogsByMeal,
  removeLogs,
  getFoodLogsTotal,
} from "@/api/logs";
import { getOneFoods } from "@/api/food";
import { fetchMacrosByDate } from "@/api/macros";

// ─── Types ────────────────────────────────────────────────────────
type TabType = "log" | "nutrition";

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

const toKey = (date: Date) => date.toISOString().slice(0, 10);

// ─── Tab Toggle ───────────────────────────────────────────────────
const TabToggle = memo(function TabToggle({
  activeTab,
  onTabChange,
}: {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}) {
  return (
    <View className="flex-row bg-slate-100 rounded-2xl p-1 mx-1 mb-3">
      <Pressable
        onPress={() => onTabChange("log")}
        className={`flex-1 flex-row gap-x-1.5 py-2.5 rounded-xl items-center justify-center ${
          activeTab === "log" ? "bg-white shadow-sm" : ""
        }`}
      >
        <Ionicons
          name="restaurant-outline"
          size={15}
          color={activeTab === "log" ? "#1e293b" : "#94a3b8"}
        />
        <Text
          className={`text-sm font-semibold ${
            activeTab === "log" ? "text-slate-800" : "text-slate-400"
          }`}
        >
          Food Log
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onTabChange("nutrition")}
        className={`flex-1 flex-row gap-x-1.5 py-2.5 rounded-xl items-center justify-center ${
          activeTab === "nutrition" ? "bg-white shadow-sm" : ""
        }`}
      >
        <Ionicons
          name="bar-chart-outline"
          size={15}
          color={activeTab === "nutrition" ? "#1e293b" : "#94a3b8"}
        />
        <Text
          className={`text-sm font-semibold ${
            activeTab === "nutrition" ? "text-slate-800" : "text-slate-400"
          }`}
        >
          Nutrition
        </Text>
      </Pressable>
    </View>
  );
});

// ─── Memoized MealSection ─────────────────────────────────────────
const MealSection = memo(function MealSection({
  title,
  calories,
  protein,
  carbs,
  fats,
  logs,
  onAdd,
  onPress,
  onLongPress,
}: {
  title: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  logs: any[];
  onAdd: () => void;
  onPress: (id: number) => void;
  onLongPress: (id: number) => void;
}) {
  return (
    <View className="bg-white rounded-[32px] border border-slate-100 shadow-sm mb-3 overflow-hidden">
      <MealCard
        title={title}
        calories={calories}
        protein={protein}
        carbs={carbs}
        fats={fats}
        onAdd={onAdd}
      />
      {logs.length > 0 && (
        <View className="bg-slate-50/30">
          {logs.map((item: any, index: number) => (
            <FoodRow
              key={item.id}
              item={item}
              isLast={index === logs.length - 1}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          ))}
        </View>
      )}
    </View>
  );
});

// ─── Main Screen ──────────────────────────────────────────────────
export default function AddFoodScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("log");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [direction, setDirection] = useState<"left" | "right">("right");

  // ── Loading counter — prevents stale async resolves from clearing the
  //    overlay when another fetch is still in flight ─────────────────────
  const loadingCountRef = useRef(0);

  const startLoading = useCallback(() => {
    loadingCountRef.current += 1;
    setLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    loadingCountRef.current = Math.max(0, loadingCountRef.current - 1);
    if (loadingCountRef.current === 0) setLoading(false);
  }, []);

  // ── Food log state ──────────────────────────────────────────────
  const [selectedMealType, setSelectedMealType] = useState<
    "breakfast" | "lunch" | "dinner" | "snack"
  >("breakfast");
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showDetailFood, setShowDetailFood] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null);

  const [breakfastLogs, setBreakfastLogs] = useState([]);
  const [lunchLogs, setLunchLogs] = useState([]);
  const [dinnerLogs, setDinnerLogs] = useState([]);
  const [snackLogs, setSnackLogs] = useState([]);

  const [goalCalories, setGoalCalories] = useState(0);
  const [foodCalories, setFoodCalories] = useState(0);
  const [remainingCalories, setRemainingCalories] = useState(0);
  const [fetchCount, setFetchCount] = useState(0);

  const [mealTotals, setMealTotals] = useState({
    breakfastCalories: 0,
    breakfastProtein: 0,
    breakfastCarbs: 0,
    breakfastFats: 0,
    lunchCalories: 0,
    lunchProtein: 0,
    lunchCarbs: 0,
    lunchFats: 0,
    dinnerCalories: 0,
    dinnerProtein: 0,
    dinnerCarbs: 0,
    dinnerFats: 0,
    snackCalories: 0,
    snackProtein: 0,
    snackCarbs: 0,
    snackFats: 0,
  });

  // ── Nutrition state ─────────────────────────────────────────────
  const [dataByDate, setDataByDate] = useState<MacroData[]>([]);
  const [nutritionError, setNutritionError] = useState<string | null>(null);

  // ── Date navigation (shared) ────────────────────────────────────
  const goPrevDay = useCallback(() => {
    setDirection("left");
    setCurrentDate((d) => new Date(d.getTime() - 86400000));
  }, []);

  const goNextDay = useCallback(() => {
    setDirection("right");
    setCurrentDate((d) => new Date(d.getTime() + 86400000));
  }, []);

  // ── Food log fetchers ───────────────────────────────────────────
  const fetchLogs = useCallback(async (date: Date) => {
    const [breakfast, lunch, dinner, snack] = await Promise.all([
      getLogsByMeal(date, "breakfast"),
      getLogsByMeal(date, "lunch"),
      getLogsByMeal(date, "dinner"),
      getLogsByMeal(date, "snack"),
    ]);
    setBreakfastLogs(breakfast);
    setLunchLogs(lunch);
    setDinnerLogs(dinner);
    setSnackLogs(snack);
  }, []);

  const fetchTotal = useCallback(async (date: Date) => {
    const total = await getFoodLogsTotal(date);
    setGoalCalories(total.goal_calories);
    setFoodCalories(total.food_calories);
    setRemainingCalories(total.remaining);
    setMealTotals({
      breakfastCalories: total.breakfast_calories,
      breakfastProtein: total.breakfast_protein,
      breakfastCarbs: total.breakfast_carbs,
      breakfastFats: total.breakfast_fats,
      lunchCalories: total.lunch_calories,
      lunchProtein: total.lunch_protein,
      lunchCarbs: total.lunch_carbs,
      lunchFats: total.lunch_fats,
      dinnerCalories: total.dinner_calories,
      dinnerProtein: total.dinner_protein,
      dinnerCarbs: total.dinner_carbs,
      dinnerFats: total.dinner_fats,
      snackCalories: total.snack_calories,
      snackProtein: total.snack_protein,
      snackCarbs: total.snack_carbs,
      snackFats: total.snack_fats,
    });
    setFetchCount((c) => c + 1);
  }, []);

  const refreshFoodLog = useCallback(
    async (date: Date) => {
      startLoading();
      try {
        await Promise.all([fetchLogs(date), fetchTotal(date)]);
      } catch (error) {
        console.error("Failed to refresh food log:", error);
      } finally {
        stopLoading();
      }
    },
    [fetchLogs, fetchTotal, startLoading, stopLoading],
  );

  // ── Nutrition fetcher ───────────────────────────────────────────
  const refreshNutrition = useCallback(async () => {
    startLoading();
    setNutritionError(null);
    try {
      const macros = await fetchMacrosByDate();
      setDataByDate(macros);
    } catch {
      setNutritionError("Failed to load nutrition data");
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  // ── Effects ─────────────────────────────────────────────────────

  // Food log: refresh whenever date changes
  useEffect(() => {
    refreshFoodLog(currentDate);
  }, [currentDate]);

  // Nutrition: refresh only when switching TO that tab
  useEffect(() => {
    if (activeTab === "nutrition") {
      refreshNutrition();
    }
  }, [activeTab]);

  // Screen focus: refresh the currently visible tab
  useFocusEffect(
    useCallback(() => {
      if (activeTab === "log") {
        refreshFoodLog(currentDate);
      } else {
        refreshNutrition();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]),
    // Intentionally only re-run on focus + tab change, not on every date/fn change
  );

  // ── Food log handlers ───────────────────────────────────────────
  const handleInsertFoodLogs = useCallback(
    async (id: number, mealType: string, quantity: number) => {
      startLoading();
      try {
        await createLogs({
          food: id,
          meal_type: mealType,
          quantity,
          created_at: currentDate,
        });
        await Promise.all([fetchLogs(currentDate), fetchTotal(currentDate)]);
        showToast("Success!", "Food logs inserted successfully", "success");
      } catch {
        showToast("Error", "Something went wrong", "error");
      } finally {
        stopLoading();
      }
    },
    [currentDate, fetchLogs, fetchTotal, startLoading, stopLoading],
  );

  const handleDetailsFood = useCallback(
    async (id: number) => {
      startLoading();
      try {
        const food = await getOneFoods(id);
        setSelectedFood(food);
        setShowDetailFood(true);
      } catch (error) {
        console.error("Failed to fetch food:", error);
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading],
  );

  const handleRemoveFoodLogs = useCallback(
    async (id: number) => {
      startLoading();
      try {
        await removeLogs(id, currentDate);
        showToast("Success", "Food logs removed successfully", "success");
        await Promise.all([fetchLogs(currentDate), fetchTotal(currentDate)]);
      } catch {
        showToast("Error", "Something went wrong", "error");
      } finally {
        stopLoading();
      }
    },
    [currentDate, fetchLogs, fetchTotal, startLoading, stopLoading],
  );

  const handleBreakfastAdd = useCallback(() => {
    setSelectedMealType("breakfast");
    setShowFoodModal(true);
  }, []);
  const handleLunchAdd = useCallback(() => {
    setSelectedMealType("lunch");
    setShowFoodModal(true);
  }, []);
  const handleDinnerAdd = useCallback(() => {
    setSelectedMealType("dinner");
    setShowFoodModal(true);
  }, []);
  const handleSnackAdd = useCallback(() => {
    setSelectedMealType("snack");
    setShowFoodModal(true);
  }, []);
  const handleLongPress = useCallback((id: number) => {
    setSelectedLogId(id);
    setShowDeleteModal(true);
  }, []);

  // ── Nutrition computed ──────────────────────────────────────────
  const dayKey = toKey(currentDate);
  const dayData = useMemo(
    () => dataByDate.find((d) => d.date === toKey(currentDate)) ?? emptyDay,
    [dataByDate, currentDate],
  );

  // ── Render ──────────────────────────────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {loading && <LoadingOverlay text="Loading..." />}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
          paddingHorizontal: 16,
          paddingTop: 8,
        }}
        removeClippedSubviews={true}
        scrollEventThrottle={16}
      >
        {/* ── Tab Toggle ───────────────────────────────────────── */}
        <TabToggle activeTab={activeTab} onTabChange={setActiveTab} />

        {/* ── Shared date header Add food log components ───────────────────────────────── */}
        <LogHeader
          currentDate={currentDate}
          onPrev={goPrevDay}
          onNext={goNextDay}
        />

        {/* ── Food Log Tab ─────────────────────────────────────── */}
        {activeTab === "log" && (
          <>
            <DailySummaryCard
              key={fetchCount}
              goalCalories={goalCalories}
              foodCalories={foodCalories}
              remainingCalories={remainingCalories}
              direction={direction}
            />

            <MealSection
              title="Breakfast"
              calories={mealTotals.breakfastCalories}
              protein={mealTotals.breakfastProtein}
              carbs={mealTotals.breakfastCarbs}
              fats={mealTotals.breakfastFats}
              logs={breakfastLogs}
              onAdd={handleBreakfastAdd}
              onPress={handleDetailsFood}
              onLongPress={handleLongPress}
            />
            <MealSection
              title="Lunch"
              calories={mealTotals.lunchCalories}
              protein={mealTotals.lunchProtein}
              carbs={mealTotals.lunchCarbs}
              fats={mealTotals.lunchFats}
              logs={lunchLogs}
              onAdd={handleLunchAdd}
              onPress={handleDetailsFood}
              onLongPress={handleLongPress}
            />
            <MealSection
              title="Dinner"
              calories={mealTotals.dinnerCalories}
              protein={mealTotals.dinnerProtein}
              carbs={mealTotals.dinnerCarbs}
              fats={mealTotals.dinnerFats}
              logs={dinnerLogs}
              onAdd={handleDinnerAdd}
              onPress={handleDetailsFood}
              onLongPress={handleLongPress}
            />
            <MealSection
              title="Snacks"
              calories={mealTotals.snackCalories}
              protein={mealTotals.snackProtein}
              carbs={mealTotals.snackCarbs}
              fats={mealTotals.snackFats}
              logs={snackLogs}
              onAdd={handleSnackAdd}
              onPress={handleDetailsFood}
              onLongPress={handleLongPress}
            />
          </>
        )}

        {/* ── Nutrition Tab ────────────────────────────────────── */}
        {activeTab === "nutrition" && (
          <>
            {nutritionError ? (
              <View className="bg-white border border-slate-100 rounded-3xl p-6">
                <Text className="text-slate-400 font-semibold text-center">
                  {nutritionError}
                </Text>
              </View>
            ) : !loading && !dayData.date ? (
              <View className="bg-white border border-slate-100 rounded-3xl p-6">
                <Text className="text-slate-400 font-semibold text-center">
                  No nutrition data for this day
                </Text>
              </View>
            ) : (
              <View className="bg-white rounded-[32px] border border-slate-100 p-5 mb-6">
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
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/*
       * ── Modals — always mounted outside ScrollView ───────────────
       * Keeping them always mounted (not gated by activeTab) prevents
       * the "stuck loading" bug caused by unmounting while a fetch is
       * still in-flight (which would skip the stopLoading() finally call).
       * They are hidden via their own `visible` prop when not in use.
       */}
      <FoodPickerModal
        visible={showFoodModal}
        onClose={() => setShowFoodModal(false)}
        onSelect={(food: FoodItem) => {
          handleInsertFoodLogs(Number(food.id), selectedMealType, 1);
          setShowFoodModal(false);
        }}
        onAddManual={() => setShowFoodModal(false)}
      />
      <FoodDetailModal
        showDetailFood={showDetailFood}
        selectedFood={selectedFood}
        setShowDetailFood={setShowDetailFood}
      />
      <DeleteFoodModal
        visible={showDeleteModal}
        selectedLogId={selectedLogId}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleRemoveFoodLogs}
      />
    </SafeAreaView>
  );
}
