import { Modal, View, Text, ScrollView, Pressable } from "react-native";

interface Props {
  showDetailFood: boolean;
  selectedFood: any;
  setShowDetailFood: (value: boolean) => void;
}

export default function FoodDetailModal({
  showDetailFood,
  selectedFood,
  setShowDetailFood,
}: Props) {
  if (!selectedFood) return null;

  return (
    <Modal visible={showDetailFood} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end sm:justify-center p-4">
        <View className="bg-white rounded-[32px] w-full max-h-[90%] overflow-hidden shadow-2xl">
          {/* Header */}
          <View className="px-6 pt-6 pb-4 border-b border-slate-100">
            <Text className="text-2xl font-extrabold text-slate-900">
              {selectedFood.name}
            </Text>

            <Text className="text-sm text-emerald-600 mt-1">
              Serving: {selectedFood.serving}
            </Text>
          </View>

          {/* Content */}
          <ScrollView
            className="px-6 pt-4"
            showsVerticalScrollIndicator={false}
          >
            {/* OVERVIEW */}
            <Text className="text-xs font-bold text-slate-400 uppercase mb-2">
              Overview
            </Text>

            <View className="bg-slate-50 rounded-2xl p-4 mb-6">
              <View className="flex-row justify-between mb-3">
                <Text>Calories</Text>
                <Text className="font-bold">
                  {selectedFood.calories ?? 0} kcal
                </Text>
              </View>

              <View className="flex-row justify-between mb-3">
                <Text>Water</Text>
                <Text className="font-bold">{selectedFood.water ?? 0} g</Text>
              </View>

              <View className="flex-row justify-between mb-3">
                <Text>Protein</Text>
                <Text className="font-bold text-blue-600">
                  {selectedFood.protein ?? 0} g
                </Text>
              </View>
            </View>

            {/* CARBOHYDRATES */}
            <Text className="text-xs font-bold text-slate-400 uppercase mb-2">
              Carbohydrates
            </Text>

            <View className="bg-slate-50 rounded-2xl p-4 mb-6">
              <View className="flex-row justify-between mb-3">
                <Text>Total Carbs</Text>
                <Text className="font-bold text-amber-600">
                  {selectedFood.total_carbs ?? 0} g
                </Text>
              </View>

              <View className="flex-row justify-between mb-3">
                <Text>Sugars</Text>
                <Text className="font-bold">{selectedFood.sugars ?? 0} g</Text>
              </View>

              <View className="flex-row justify-between mb-3">
                <Text>Fiber</Text>
                <Text className="font-bold">{selectedFood.fiber ?? 0} g</Text>
              </View>

              <View className="flex-row justify-between">
                <Text>Starch</Text>
                <Text className="font-bold">{selectedFood.starch ?? 0} g</Text>
              </View>
            </View>

            {/* FATS */}
            <Text className="text-xs font-bold text-slate-400 uppercase mb-2">
              Fats & Cholesterol
            </Text>

            <View className="bg-slate-50 rounded-2xl p-4 mb-6">
              <View className="flex-row justify-between mb-3">
                <Text>Total Fat</Text>
                <Text className="font-bold text-rose-600">
                  {selectedFood.total_fat ?? 0} g
                </Text>
              </View>

              <View className="flex-row justify-between mb-3">
                <Text>Saturated Fat</Text>
                <Text className="font-bold">
                  {selectedFood.saturated_fat ?? 0} g
                </Text>
              </View>

              <View className="flex-row justify-between mb-3">
                <Text>Monounsaturated Fat</Text>
                <Text className="font-bold">
                  {selectedFood.monounsaturated_fat ?? 0} g
                </Text>
              </View>

              <View className="flex-row justify-between mb-3">
                <Text>Polyunsaturated Fat</Text>
                <Text className="font-bold">
                  {selectedFood.polyunsaturated_fat ?? 0} g
                </Text>
              </View>

              <View className="flex-row justify-between mb-3">
                <Text>Trans Fat</Text>
                <Text className="font-bold">
                  {selectedFood.trans_fat ?? 0} g
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text>Cholesterol</Text>
                <Text className="font-bold">
                  {selectedFood.cholesterol ?? 0} mg
                </Text>
              </View>
            </View>

            {/* VITAMINS */}
            <Text className="text-xs font-bold text-slate-400 uppercase mb-2">
              Vitamins
            </Text>

            <View className="bg-slate-50 rounded-2xl p-4 mb-6 flex-row flex-wrap justify-between">
              {[
                ["Vitamin A", selectedFood.vitamin_a],
                ["Vitamin C", selectedFood.vitamin_c],
                ["Vitamin E", selectedFood.vitamin_e],
                ["Vitamin K", selectedFood.vitamin_k],
                ["Vitamin B1", selectedFood.vitamin_b1],
                ["Vitamin B2", selectedFood.vitamin_b2],
                ["Vitamin B3", selectedFood.vitamin_b3],
                ["Vitamin B6", selectedFood.vitamin_b6],
                ["Vitamin B9", selectedFood.vitamin_b9],
                ["Vitamin B12", selectedFood.vitamin_b12],
              ].map(([label, value], index) => (
                <View key={index} className="w-[48%] mb-3">
                  <Text className="text-xs text-slate-500">{label}</Text>
                  <Text className="font-bold">{value ?? 0}</Text>
                </View>
              ))}
            </View>

            {/* MINERALS */}
            <Text className="text-xs font-bold text-slate-400 uppercase mb-2">
              Minerals
            </Text>

            <View className="bg-slate-50 rounded-2xl p-4 mb-6 flex-row flex-wrap justify-between">
              {[
                ["Calcium", selectedFood.calcium],
                ["Iron", selectedFood.iron],
                ["Magnesium", selectedFood.magnesium],
                ["Phosphorus", selectedFood.phosphorus],
                ["Potassium", selectedFood.potassium],
                ["Sodium", selectedFood.sodium],
                ["Zinc", selectedFood.zinc],
                ["Copper", selectedFood.copper],
                ["Manganese", selectedFood.manganese],
              ].map(([label, value], index) => (
                <View key={index} className="w-[48%] mb-3">
                  <Text className="text-xs text-slate-500">{label}</Text>
                  <Text className="font-bold">{value ?? 0} mg</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="p-4 border-t border-slate-100">
            <Pressable
              onPress={() => setShowDetailFood(false)}
              className="bg-emerald-500 py-4 rounded-full"
            >
              <Text className="text-center text-white font-bold">Close</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
