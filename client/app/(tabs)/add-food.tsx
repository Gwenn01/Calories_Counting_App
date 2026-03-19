import { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
// components
import LoadingOverlay from "@/components/LoadingOverplay";
import { useToast } from "@/components/ToastProvider";
import { FoodPickerModal } from "@/components/AddFood/FoodPickerModal";
import FoodDetailModal from "@/components/AddFood/FoodDetailModal";
import DeleteFoodModal from "@/components/AddFood/DeleteFoodModal";
import FoodRow from "@/components/AddFood/FoodRow";
import CalorieItem from "@/components/AddFood/CalorieItem";
import MealCard from "@/components/AddFood/MealCard";
import type { FoodItem } from "@/types/foods";
// apis
import {
  createLogs,
  getLogsByMeal,
  removeLogs,
  getFoodLogsTotal,
} from "@/api/logs";
import { getOneFoods } from "@/api/food";

/* ---------------- DATE HELPERS ---------------- */
const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function AddFoodScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [selectedMealType, setSelectedMealType] = useState<
    "breakfast" | "lunch" | "dinner" | "snack"
  >("breakfast");
  const isCurrentDay = currentDate.toDateString() === new Date().toDateString();
  // add food model
  const [showFoodModal, setShowFoodModal] = useState(false);
  // the selected foods
  const [breakfastLogs, setBreakfastLogs] = useState([]);
  const [lunchLogs, setLunchLogs] = useState([]);
  const [dinnerLogs, setDinnerLogs] = useState([]);
  const [snackLogs, setSnackLogs] = useState([]);
  // total
  const [goalCalories, setGoalCalories] = useState(0);
  const [foodCalories, setFoodCalories] = useState(0);
  const [remainingCalories, setRemainingCalories] = useState(0);
  const [breakfastCalories, setBreakfastCalories] = useState(0);
  const [lunchCalories, setLunchCalories] = useState(0);
  const [dinnerCalories, setDinnerCalories] = useState(0);
  const [snackCalories, setSnackCalories] = useState(0);

  // for long press and press detail and remove logs
  // details foods
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [showDetailFood, setShowDetailFood] = useState(false);
  // remove modal
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // function to explicity go to next and previous day
  // date provider
  const goPrevDay = () =>
    setCurrentDate((d) => {
      const newDate = new Date(d);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  const goNextDay = () =>
    setCurrentDate((d) => {
      const newDate = new Date(d);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });

  // fetch the log
  const fetchLogs = async (date: Date) => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };
  // fetch total
  const fetchTotal = async (date: Date) => {
    try {
      setLoading(true);
      const total = await getFoodLogsTotal(date);
      setGoalCalories(total.goal_calories);
      setFoodCalories(total.food_calories);
      setRemainingCalories(total.remaining);
      setBreakfastCalories(total.breakfast_calories);
      setLunchCalories(total.lunch_calories);
      setDinnerCalories(total.dinner_calories);
      setSnackCalories(total.snack_calories);
    } catch (error) {
      console.error("Failed to fetch total:", error);
    } finally {
      setLoading(false);
    }
  };
  // fetch logs
  useEffect(() => {
    fetchLogs(currentDate);
    fetchTotal(currentDate);
  }, [currentDate]);

  // function for handle
  const handleInsertFoodLogs = async (
    id: number,
    mealType: string,
    quantity: number,
  ): Promise<void> => {
    try {
      setLoading(true);
      await createLogs({
        food: id,
        meal_type: mealType,
        quantity: quantity,
        created_at: currentDate,
      });
      fetchLogs(currentDate);
      fetchTotal(currentDate);
      showToast("Success!", "Food logs inserted successfully", "success");
    } catch (error: any) {
      showToast("Error", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };
  // handle details foods
  const handleDetailsFood = async (id: number): Promise<void> => {
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
  };
  const handleRemoveFoodLogs = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      await removeLogs(id, currentDate);
      showToast("Success", "Food logs removed successfully", "success");
      fetchLogs(currentDate);
      fetchTotal(currentDate);
    } catch (error) {
      console.log(error);
      showToast("Error", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };
  // data

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {loading && <LoadingOverlay text="Loading nutrition..." />}
      <ScrollView
        className="px-4 pt-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header ==============================================================*/}
        {/* ---------- HEADER ---------- */}

        <View className="flex-row items-center justify-between mb-4 bg-white rounded-[20px] px-4 py-4 border border-slate-100">
          {/* Prev */}
          <Pressable
            onPress={goPrevDay}
            className="w-10 h-10 rounded-[14px] bg-slate-900  border border-slate-100 items-center justify-center"
          >
            <Feather name="chevron-left" size={18} color="#fff" />
          </Pressable>

          {/* Center */}
          <View className="flex-1 items-center px-3 gap-0.5">
            {/* Label + calendar icon */}
            <View className="flex-row items-center gap-1.5 mb-0.5">
              <Feather name="calendar" size={11} color="#94a3b8" />
              <Text className="text-[10px] font-bold tracking-[2px] uppercase text-slate-400">
                Food Log
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

        {/* Calories Remaining Card ========================================*/}
        <View
          className="rounded-[28px] p-5 mb-4"
          style={{
            backgroundColor: "#0f172a",
            borderWidth: 1,
            borderColor: "#1e293b",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 24,
            elevation: 12,
          }}
        >
          {/* Header */}
          <View className="flex-row items-center mb-4 gap-2">
            <View
              className="p-1.5 rounded-xl"
              style={{
                backgroundColor: "#052e16",
                borderWidth: 1,
                borderColor: "#14532d",
              }}
            >
              <Feather name="pie-chart" size={13} color="#4ade80" />
            </View>
            <Text
              className="text-[10px] font-black text-slate-500"
              style={{ letterSpacing: 2 }}
            >
              DAILY SUMMARY
            </Text>
          </View>

          {/* Stats Row */}
          <View
            className="flex-row items-stretch rounded-[20px] overflow-hidden"
            style={{
              backgroundColor: "#0d1f2d",
              borderWidth: 1,
              borderColor: "#1e293b",
            }}
          >
            {/* Goal */}
            <View className="flex-1 items-center py-4 px-3">
              <Text
                className="text-[9px] font-black text-slate-600 mb-1.5 uppercase"
                style={{ letterSpacing: 1.5 }}
              >
                Goal
              </Text>
              <Text
                className="font-black text-slate-200"
                style={{ fontSize: 22, letterSpacing: -0.5 }}
              >
                {goalCalories}
              </Text>
              <Text className="text-[9px] text-slate-600 font-semibold mt-0.5">
                kcal
              </Text>
            </View>

            {/* Vertical Divider */}
            <View
              className="w-[1px] my-3"
              style={{ backgroundColor: "#1e293b" }}
            />

            {/* Food */}
            <View className="flex-1 items-center py-4 px-3">
              <Text
                className="text-[9px] font-black text-slate-600 mb-1.5 uppercase"
                style={{ letterSpacing: 1.5 }}
              >
                Food
              </Text>
              <Text
                className="font-black text-slate-200"
                style={{ fontSize: 22, letterSpacing: -0.5 }}
              >
                {foodCalories}
              </Text>
              <Text className="text-[9px] text-slate-600 font-semibold mt-0.5">
                kcal
              </Text>
            </View>

            {/* Vertical Divider */}
            <View
              className="w-[1px] my-3"
              style={{ backgroundColor: "#1e293b" }}
            />

            {/* Remaining — highlighted */}
            <View
              className="flex-1 items-center justify-center py-4 px-3 rounded-[20px]"
              style={{
                backgroundColor: "#052e16",
                borderWidth: 1,
                borderColor: "#14532d",
                margin: 4,
              }}
            >
              <Text
                className="text-[9px] font-black text-emerald-700 mb-1.5 uppercase"
                style={{ letterSpacing: 1.5 }}
              >
                Left
              </Text>
              <Text
                className="font-black text-emerald-400"
                style={{ fontSize: 22, letterSpacing: -0.5 }}
              >
                {remainingCalories}
              </Text>
              <Text className="text-[9px] text-emerald-800 font-semibold mt-0.5">
                kcal
              </Text>
            </View>
          </View>

          {/* Bottom progress bar */}
          <View className="mt-4 px-1">
            <View className="flex-row justify-between mb-1.5">
              <Text
                className="text-[9px] text-slate-600 font-bold uppercase"
                style={{ letterSpacing: 1 }}
              >
                Progress
              </Text>
              <Text className="text-[9px] text-slate-500 font-bold">
                {Math.min(Math.round((foodCalories / goalCalories) * 100), 100)}
                %
              </Text>
            </View>
            <View
              className="h-1 rounded-full overflow-hidden"
              style={{ backgroundColor: "#1e293b" }}
            >
              <View
                className="h-full rounded-full"
                style={{
                  width: `${Math.min((foodCalories / goalCalories) * 100, 100)}%`,
                  backgroundColor: "#4ade80",
                  shadowColor: "#4ade80",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 4,
                }}
              />
            </View>
          </View>
        </View>

        {/* MEAL CARDS ========================================================================================= */}
        {/* Breakfast Section */}
        <View className="bg-white rounded-[32px] border border-slate-100 shadow-sm mb-3 overflow-hidden">
          {/* The Header */}
          <MealCard
            title="Breakfast"
            calories={breakfastCalories}
            onAdd={() => {
              setSelectedMealType("breakfast");
              setShowFoodModal(true);
            }}
          />

          {/* The Items */}
          {breakfastLogs.length > 0 && (
            <View className="bg-slate-50/30">
              {breakfastLogs.map((item: any, index: number) => (
                <FoodRow
                  key={item.id}
                  item={item}
                  // Pass a prop to know if it's the last item so we can remove the bottom border
                  isLast={index === breakfastLogs.length - 1}
                  onPress={(id: number) => handleDetailsFood(id)}
                  onLongPress={(id: number) => {
                    setSelectedLogId(id);
                    setShowDeleteModal(true);
                  }}
                />
              ))}
            </View>
          )}
        </View>

        {/* Lunch Section */}
        <View className="bg-white rounded-[32px] border border-slate-100 shadow-sm mb-3 overflow-hidden">
          <MealCard
            title="Lunch"
            calories={lunchCalories}
            onAdd={() => {
              setSelectedMealType("lunch");
              setShowFoodModal(true);
            }}
          />
          {lunchLogs.length > 0 && (
            <View className="bg-slate-50/30">
              {lunchLogs.map((item: any, index: number) => (
                <FoodRow
                  key={item.id}
                  item={item}
                  isLast={index === lunchLogs.length - 1}
                  onPress={(id: number) => {
                    handleDetailsFood(id);
                  }}
                  onLongPress={(id: number) => {
                    setSelectedLogId(id);
                    setShowDeleteModal(true);
                  }}
                />
              ))}
            </View>
          )}
        </View>

        {/* Dinner Section */}
        <View className="bg-white rounded-[32px] border border-slate-100 shadow-sm mb-3 overflow-hidden">
          <MealCard
            title="Dinner"
            calories={dinnerCalories}
            onAdd={() => {
              setSelectedMealType("dinner");
              setShowFoodModal(true);
            }}
          />
          {dinnerLogs.length > 0 && (
            <View className="bg-slate-50/30">
              {dinnerLogs.map((item: any, index: number) => (
                <FoodRow
                  key={item.id}
                  item={item}
                  isLast={index === dinnerLogs.length - 1}
                  onPress={(id: number) => {
                    handleDetailsFood(id);
                  }}
                  onLongPress={(id: number) => {
                    setSelectedLogId(id);
                    setShowDeleteModal(true);
                  }}
                />
              ))}
            </View>
          )}
        </View>

        {/* Snacks Section */}
        <View className="bg-white rounded-[32px] border border-slate-100 shadow-sm mb-3 overflow-hidden">
          <MealCard
            title="Snacks"
            calories={snackCalories}
            onAdd={() => {
              setSelectedMealType("snack");
              setShowFoodModal(true);
            }}
          />
          {snackLogs.length > 0 && (
            <View className="bg-slate-50/30">
              {snackLogs.map((item: any, index: number) => (
                <FoodRow
                  key={item.id}
                  item={item}
                  isLast={index === snackLogs.length - 1}
                  onPress={(id: number) => {
                    handleDetailsFood(id);
                  }}
                  onLongPress={(id: number) => {
                    setSelectedLogId(id);
                    setShowDeleteModal(true);
                  }}
                />
              ))}
            </View>
          )}
        </View>

        {/* FOOD PICKER MODAL ========================================================================================= */}
        {/* modal for add foods */}
        <FoodPickerModal
          visible={showFoodModal}
          onClose={() => setShowFoodModal(false)}
          onSelect={(food: FoodItem) => {
            handleInsertFoodLogs(Number(food.id), selectedMealType, 1);
            setShowFoodModal(false);
          }}
          onAddManual={() => {
            setShowFoodModal(false); // close picker
          }}
        />
        {/* MODAL ========================================================================================= */}
        {/*  food details modal confirmations */}
        <FoodDetailModal
          showDetailFood={showDetailFood}
          selectedFood={selectedFood}
          setShowDetailFood={setShowDetailFood}
        />
        {/* remove food modal confirmations */}
        <DeleteFoodModal
          visible={showDeleteModal}
          selectedLogId={selectedLogId}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleRemoveFoodLogs}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
