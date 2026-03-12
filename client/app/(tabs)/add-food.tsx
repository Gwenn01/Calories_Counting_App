import { useState, useEffect } from "react";
import { Modal, View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FoodPickerModal } from "@/components/AddFood/FoodPickerModal";
import { AddFoodManualModal } from "@/components/AddFood/AddFoodManualModal";
import type { FoodItem } from "@/types/foods";
import LoadingOverlay from "@/components/LoadingOverplay";
import { useToast } from "@/components/ToastProvider";
import {
  createLogs,
  getLogsByMeal,
  removeLogs,
  getFoodLogsTotal,
} from "@/api/logs";

/* ---------------- DATE HELPERS ---------------- */
const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snacks";
type MealCardProps = {
  title: string;
  calories: number;
  onAdd: () => void;
};

export default function AddFoodScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [selectedMealType, setSelectedMealType] = useState<
    "breakfast" | "lunch" | "dinner" | "snack"
  >("breakfast");
  // add food model
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
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

  // for long press remove logs
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

  const handleRemoveFoodLogs = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      await removeLogs(id);
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
        showsVerticalScrollIndicator={false}
        //contentContainerClassName="p-5 pb-32"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
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
              Today Food
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

        {/* Calories Remaining Card */}
        <View className="bg-white rounded-[28px] p-5 mb-7 border border-slate-100">
          <Text className="text-sm font-extrabold text-slate-500 mb-4">
            Calories Remaining
          </Text>

          <View className="flex-row items-center justify-between flex-wrap">
            <CalorieItem label="Goal" value={goalCalories} />
            <Text className="text-lg font-extrabold text-slate-400">−−</Text>
            <CalorieItem label="Food" value={foodCalories} />
            <Text className="text-lg font-extrabold text-slate-400">=</Text>

            <View className="bg-slate-900 px-4 py-2.5 rounded-xl items-center">
              <Text className="text-xl font-black text-green-500">
                {remainingCalories}
              </Text>
              <Text className="text-[11px] text-slate-400">Remaining</Text>
            </View>
          </View>
        </View>

        {/* Meals Cards */}
        {/* Breakfast */}
        <MealCard
          title="Breakfast"
          calories={breakfastCalories}
          onAdd={() => {
            setSelectedMealType("breakfast");
            setShowFoodModal(true);
          }}
        />

        {breakfastLogs.map((item: any) => (
          <FoodRow
            key={item.id}
            item={item}
            onLongPress={(id: number) => {
              setSelectedLogId(id);
              setShowDeleteModal(true);
            }}
          />
        ))}

        {/* Lunch */}
        <MealCard
          title="Lunch"
          calories={lunchCalories}
          onAdd={() => {
            setSelectedMealType("lunch");
            setShowFoodModal(true);
          }}
        />

        {lunchLogs.map((item: any) => (
          <FoodRow
            key={item.id}
            item={item}
            onLongPress={(id: number) => {
              setSelectedLogId(id);
              setShowDeleteModal(true);
            }}
          />
        ))}

        {/* Dinner */}
        <MealCard
          title="Dinner"
          calories={dinnerCalories}
          onAdd={() => {
            setSelectedMealType("dinner");
            setShowFoodModal(true);
          }}
        />

        {dinnerLogs.map((item: any) => (
          <FoodRow
            key={item.id}
            item={item}
            onLongPress={(id: number) => {
              setSelectedLogId(id);
              setShowDeleteModal(true);
            }}
          />
        ))}

        {/* Snacks */}
        <MealCard
          title="Snacks"
          calories={snackCalories}
          onAdd={() => {
            setSelectedMealType("snack");
            setShowFoodModal(true);
          }}
        />

        {snackLogs.map((item: any) => (
          <FoodRow
            key={item.id}
            item={item}
            onLongPress={(id: number) => {
              setSelectedLogId(id);
              setShowDeleteModal(true);
            }}
          />
        ))}
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
            setShowManualModal(true); // OPEN manual modal
          }}
        />
        {/* add manual */}
        <AddFoodManualModal
          visible={showManualModal}
          onClose={() => setShowManualModal(false)}
        />
        {/* add using scan */}
        {/* remove food modal confirmations */}
        <Modal visible={showDeleteModal} transparent animationType="fade">
          <View className="flex-1 bg-black/40 justify-center items-center">
            <View className="bg-white p-6 rounded-2xl w-72">
              <Text className="text-lg font-bold mb-2">Remove Food?</Text>

              <Text className="text-slate-500 mb-5">
                This food will be removed from your log.
              </Text>

              <View className="flex-row justify-end gap-3">
                <Pressable
                  onPress={() => setShowDeleteModal(false)}
                  className="px-4 py-2"
                >
                  <Text className="text-slate-500">Cancel</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    if (selectedLogId) {
                      handleRemoveFoodLogs(selectedLogId);
                    }
                    setShowDeleteModal(false);
                  }}
                  className="px-4 py-2 bg-red-500 rounded-lg"
                >
                  <Text className="text-white font-bold">Delete</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

// small components
/* ---------- Components ---------- */

function CalorieItem({ label, value }: any) {
  return (
    <View className="items-center min-w-[60px]">
      <Text className="text-lg font-extrabold text-slate-900">{value}</Text>
      <Text className="text-[11px] text-slate-400 mt-0.5">{label}</Text>
    </View>
  );
}

function MealCard({ title, calories, onAdd }: MealCardProps) {
  return (
    <View className="bg-white rounded-[24px] p-4 mb-4 border border-slate-100 shadow-sm flex-row items-center justify-between">
      {/* Added flex-1 and pr-4 so long titles don't push the button off-screen */}
      <View className="flex-1 pr-4">
        <Text className="text-base font-bold text-slate-800 tracking-tight">
          {title}
        </Text>

        <Text className="text-sm font-medium text-slate-500 mt-0.5">
          {calories > 0 ? `${calories} kcal` : "No food logged"}
        </Text>
      </View>

      <Pressable
        onPress={onAdd}
        // Changed to a pill-shaped, solid primary button for a more tactile, app-like feel
        className="flex-row items-center bg-emerald-500 px-4 py-2.5 rounded-full active:bg-emerald-600"
      >
        <Feather name="plus" size={16} color="#ffffff" />
        <Text className="ml-1.5 text-sm font-semibold text-white tracking-wide">
          Add Food
        </Text>
      </Pressable>
    </View>
  );
}

const FoodRow = ({ item, onLongPress }: any) => (
  <Pressable onLongPress={() => onLongPress(item.id)}>
    <View className="flex-row justify-between px-4 py-3 border-b border-slate-100">
      <View>
        <Text className="font-semibold">{item.food_details.name}</Text>
        <Text className="text-xs text-slate-500">
          {item.food_details.serving}
        </Text>
      </View>

      <Text className="font-bold">{item.food_details.calories} kcal</Text>
    </View>
  </Pressable>
);
