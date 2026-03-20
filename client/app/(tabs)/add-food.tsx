import { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
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
  const [fetchCount, setFetchCount] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  // meal card
  const [breakfastCalories, setBreakfastCalories] = useState(0);
  const [breakfastProtein, setBreakfastProtein] = useState(0);
  const [breakfastCarbs, setBreakfastCarbs] = useState(0);
  const [breakfastFats, setBreakfastFats] = useState(0);
  const [lunchCalories, setLunchCalories] = useState(0);
  const [lunchProtein, setLunchProtein] = useState(0);
  const [lunchCarbs, setLunchCarbs] = useState(0);
  const [lunchFats, setLunchFats] = useState(0);
  const [dinnerCalories, setDinnerCalories] = useState(0);
  const [dinnerProtein, setDinnerProtein] = useState(0);
  const [dinnerCarbs, setDinnerCarbs] = useState(0);
  const [dinnerFats, setDinnerFats] = useState(0);
  const [snackCalories, setSnackCalories] = useState(0);
  const [snackProtein, setSnackProtein] = useState(0);
  const [snackCarbs, setSnackCarbs] = useState(0);
  const [snackFats, setSnackFats] = useState(0);

  // for long press and press detail and remove logs
  // details foods
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [showDetailFood, setShowDetailFood] = useState(false);
  // remove modal
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // function to explicity go to next and previous day
  // date provider
  const goPrevDay = () => {
    setDirection("left");
    setCurrentDate((d) => new Date(d.getTime() - 86400000));
  };

  const goNextDay = () => {
    setDirection("right");
    setCurrentDate((d) => new Date(d.getTime() + 86400000));
  };

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
      setBreakfastProtein(total.breakfast_protein);
      setBreakfastCarbs(total.breakfast_carbs);
      setBreakfastFats(total.breakfast_fats);
      setLunchCalories(total.lunch_calories);
      setLunchProtein(total.lunch_protein);
      setLunchCarbs(total.lunch_carbs);
      setLunchFats(total.lunch_fats);
      setDinnerCalories(total.dinner_calories);
      setDinnerProtein(total.dinner_protein);
      setDinnerCarbs(total.dinner_carbs);
      setDinnerFats(total.dinner_fats);
      setSnackCalories(total.snack_calories);
      setSnackProtein(total.snack_protein);
      setSnackCarbs(total.snack_carbs);
      setSnackFats(total.snack_fats);
      setFetchCount(() => fetchCount + 1);
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

        <LogHeader
          currentDate={currentDate}
          onPrev={goPrevDay}
          onNext={goNextDay}
        />

        {/* Calories Remaining Card ========================================*/}
        <DailySummaryCard
          key={fetchCount}
          goalCalories={goalCalories}
          foodCalories={foodCalories}
          remainingCalories={remainingCalories}
          direction={direction}
        />
        {/* MEAL CARDS ========================================================================================= */}
        {/* Breakfast Section */}
        <View className="bg-white rounded-[32px] border border-slate-100 shadow-sm mb-3 overflow-hidden">
          {/* The Header */}
          <MealCard
            title="Breakfast"
            calories={breakfastCalories}
            protein={breakfastProtein}
            carbs={breakfastCarbs}
            fats={breakfastFats}
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
            protein={lunchProtein}
            carbs={lunchCarbs}
            fats={lunchFats}
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
            protein={dinnerProtein}
            carbs={dinnerCarbs}
            fats={dinnerFats}
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
            protein={snackProtein}
            carbs={snackCarbs}
            fats={snackFats}
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
