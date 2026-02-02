import { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FoodPickerModal } from "@/components/food/FoodPickerModal";
import type { FoodItem } from "@/types/foods";

type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snacks";

export default function AddFoodScreen() {
  const router = useRouter();
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [activeMeal, setActiveMeal] = useState<MealType | null>(null);

  const goal = 2000;
  const food = 850;
  const exercise = 200;
  const remaining = goal - food + exercise;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="p-5 pb-32"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Pressable className="bg-white p-2.5 rounded-xl border border-slate-100">
            <Feather name="chevron-left" size={22} color="#0f172a" />
          </Pressable>

          <View>
            <Text className="text-xs font-bold text-slate-400 text-center">
              Today
            </Text>
            <Text className="text-xl font-black text-slate-900 text-center">
              Feb 1, 2026
            </Text>
          </View>

          <Pressable className="bg-white p-2.5 rounded-xl border border-slate-100">
            <Feather name="chevron-right" size={22} color="#0f172a" />
          </Pressable>
        </View>

        {/* Calories Remaining Card */}
        <View className="bg-white rounded-[28px] p-5 mb-7 border border-slate-100">
          <Text className="text-sm font-extrabold text-slate-500 mb-4">
            Calories Remaining
          </Text>

          <View className="flex-row items-center justify-between flex-wrap">
            <CalorieItem label="Goal" value={goal} />
            <Text className="text-lg font-extrabold text-slate-400">−</Text>
            <CalorieItem label="Food" value={food} />
            <Text className="text-lg font-extrabold text-slate-400">+</Text>
            <CalorieItem label="Exercise" value={exercise} />
            <Text className="text-lg font-extrabold text-slate-400">=</Text>

            <View className="bg-slate-900 px-4 py-2.5 rounded-xl items-center">
              <Text className="text-xl font-black text-green-500">
                {remaining}
              </Text>
              <Text className="text-[11px] text-slate-400">Remaining</Text>
            </View>
          </View>
        </View>

        {/* Meals */}
        <MealCard title="Breakfast" onAdd={() => setShowFoodModal(true)} />
        <MealCard title="Lunch" onAdd={() => router.push("/add-food")} />
        <MealCard title="Dinner" onAdd={() => router.push("/add-food")} />
        <MealCard title="Snacks" onAdd={() => router.push("/add-food")} />

        <FoodPickerModal
          visible={showFoodModal}
          onClose={() => setShowFoodModal(false)}
          onSelect={(food: FoodItem) => {
            console.log("Selected food:", food);
            setShowFoodModal(false);
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Components ---------- */

function CalorieItem({ label, value }: any) {
  return (
    <View className="items-center min-w-[60px]">
      <Text className="text-lg font-extrabold text-slate-900">{value}</Text>
      <Text className="text-[11px] text-slate-400 mt-0.5">{label}</Text>
    </View>
  );
}

function MealCard({ title, onAdd }: any) {
  return (
    <View className="bg-white rounded-3xl p-5 mb-4 border border-slate-100 flex-row items-center justify-between">
      <View>
        <Text className="text-lg font-extrabold text-slate-900">{title}</Text>
        <Text className="text-sm text-slate-400 mt-0.5">No food logged</Text>
      </View>

      <Pressable
        onPress={onAdd}
        className="flex-row items-center bg-emerald-50 px-3.5 py-2 rounded-xl"
      >
        <Feather name="plus" size={18} color="#10b981" />
        <Text className="ml-1.5 text-sm font-bold text-emerald-500">
          Add Food
        </Text>
      </Pressable>
    </View>
  );
}
