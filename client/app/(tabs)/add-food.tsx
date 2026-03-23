import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { FoodItem } from "@/types/foods";
// components
import LoadingOverlay from "@/components/LoadingOverplay";
import { useToast } from "@/components/ToastProvider";
import { FoodPickerModal } from "@/components/AddFood/FoodPickerModal";
import FoodDetailModal from "@/components/AddFood/FoodDetailModal";
import DeleteFoodModal from "@/components/AddFood/DeleteFoodModal";
import FoodRow from "@/components/AddFood/FoodRow";
import MealCard from "@/components/AddFood/MealCard";
import LogHeader from "@/components/AddFood/LogHeader";
import DailySummaryCard from "@/components/AddFood/DailySummaryCard";
// apis
import {
  createLogs,
  getLogsByMeal,
  removeLogs,
  getFoodLogsTotal,
} from "@/api/logs";
import { getOneFoods } from "@/api/food";

// ─── Memoized MealSection to prevent re-renders ───────────────────
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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [selectedMealType, setSelectedMealType] = useState<
    "breakfast" | "lunch" | "dinner" | "snack"
  >("breakfast");

  // modals
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showDetailFood, setShowDetailFood] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null);

  // logs
  const [breakfastLogs, setBreakfastLogs] = useState([]);
  const [lunchLogs, setLunchLogs] = useState([]);
  const [dinnerLogs, setDinnerLogs] = useState([]);
  const [snackLogs, setSnackLogs] = useState([]);

  // totals
  const [goalCalories, setGoalCalories] = useState(0);
  const [foodCalories, setFoodCalories] = useState(0);
  const [remainingCalories, setRemainingCalories] = useState(0);
  const [fetchCount, setFetchCount] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  // meal macros
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

  const goPrevDay = useCallback(() => {
    setDirection("left");
    setCurrentDate((d) => new Date(d.getTime() - 86400000));
  }, []);

  const goNextDay = useCallback(() => {
    setDirection("right");
    setCurrentDate((d) => new Date(d.getTime() + 86400000));
  }, []);

  const fetchLogs = useCallback(async (date: Date) => {
    try {
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
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    }
  }, []);

  const fetchTotal = useCallback(async (date: Date) => {
    try {
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
    } catch (error) {
      console.error("Failed to fetch total:", error);
    }
  }, []);

  const refreshAll = useCallback(
    async (date: Date) => {
      setLoading(true);
      await Promise.all([fetchLogs(date), fetchTotal(date)]);
      setLoading(false);
    },
    [fetchLogs, fetchTotal],
  );

  useEffect(() => {
    refreshAll(currentDate);
  }, [currentDate]);

  const handleInsertFoodLogs = useCallback(
    async (id: number, mealType: string, quantity: number) => {
      try {
        setLoading(true);
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
        setLoading(false);
      }
    },
    [currentDate, fetchLogs, fetchTotal],
  );

  const handleDetailsFood = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const food = await getOneFoods(id);
      setSelectedFood(food);
      setShowDetailFood(true);
    } catch (error) {
      console.error("Failed to fetch food:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRemoveFoodLogs = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        await removeLogs(id, currentDate);
        showToast("Success", "Food logs removed successfully", "success");
        await Promise.all([fetchLogs(currentDate), fetchTotal(currentDate)]);
      } catch {
        showToast("Error", "Something went wrong", "error");
      } finally {
        setLoading(false);
      }
    },
    [currentDate, fetchLogs, fetchTotal],
  );

  // Memoized handlers to prevent MealSection re-renders
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

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {loading && <LoadingOverlay text="Loading nutrition..." />}

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
        <LogHeader
          currentDate={currentDate}
          onPrev={goPrevDay}
          onNext={goNextDay}
        />

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
      </ScrollView>

      {/* ✅ Modals OUTSIDE ScrollView */}
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
