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
        <View className="flex-row items-center justify-between mb-4">
          <Pressable
            onPress={goPrevDay}
            className="bg-white p-2.5 rounded-2xl border border-slate-100"
          >
            <Feather name="chevron-left" size={22} color="#0f172a" />
          </Pressable>

          <View className="items-center">
            <Text className="text-xs font-bold tracking-[2px] uppercase text-slate-400">
              Today Food
            </Text>
            <Text className="text-sm font-semibold text-slate-500">
              {currentDate.toLocaleDateString("en-US", { weekday: "long" })}
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

        {/* Calories Remaining Card ========================================*/}
        <View className="bg-white rounded-[32px] p-4 mb-4 shadow-sm border border-slate-100">
          {/* Header with Icon */}
          <View className="flex-row items-center mb-3 px-2 gap-2">
            <View className="bg-emerald-50 p-1.5 rounded-lg border border-emerald-100">
              <Feather name="pie-chart" size={14} color="#059669" />
            </View>
            <Text
              className="text-[11px] font-black text-slate-400"
              style={{ letterSpacing: 1.5 }}
            >
              DAILY SUMMARY
            </Text>
          </View>

          {/*The Split Pill Container */}
          <View className="flex-row items-center bg-slate-50 p-1.5 rounded-[28px]">
            {/* Left Side: Stats (Goal & Food) */}
            <View className="flex-row flex-1 justify-evenly items-center py-2">
              <View className="items-center">
                <Text
                  className="text-slate-400 text-[10px] font-bold uppercase mb-0.5"
                  style={{ letterSpacing: 1 }}
                >
                  Goal
                </Text>
                <Text className="text-slate-800 font-extrabold text-lg">
                  {goalCalories}
                </Text>
              </View>
              {/* Subtle Vertical Divider instead of a Minus Sign */}
              <View className="w-[1.5px] h-8 bg-slate-200 rounded-full" />

              <View className="items-center">
                <Text
                  className="text-slate-400 text-[10px] font-bold uppercase mb-0.5"
                  style={{ letterSpacing: 1 }}
                >
                  Food
                </Text>
                <Text className="text-slate-800 font-extrabold text-lg">
                  {foodCalories}
                </Text>
              </View>
            </View>
            {/* Right Side: Highlight (Left) */}
            <View className="bg-slate-900 rounded-[24px] px-6 py-3.5 items-center shadow-sm ml-2">
              <Text
                className="text-emerald-50 text-[10px] font-bold uppercase mb-0.5"
                style={{ letterSpacing: 1 }}
              >
                REMAINING
              </Text>
              <Text className="text-white font-black text-xl">
                {remainingCalories}
              </Text>
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
