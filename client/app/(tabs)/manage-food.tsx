import { useState, useEffect } from "react";
import { View, Text, Pressable, FlatList, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
// components
import LoadingOverlay from "@/components/LoadingOverplay";
import { AddFoodManualModal } from "@/components/ManageFood/AddFoodManualModal";
import ManageFoodModal from "@/components/ManageFood/ManageFoodModal";
// apis
import { getAllFoods } from "@/api/food";

type Food = {
  id: number;
  name: string;
  serving: string;
  calories: number;
  protein: number;
  total_carbs: number;
  total_fat: number;
};

export default function ManageFoodScreen() {
  const [loading, setLoading] = useState(false);
  const [foods, setFoods] = useState<Food[]>([]);
  const [search, setSearch] = useState("");
  const [showManualModal, setShowManualModal] = useState(false);
  // manage food
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  // Fetch foods
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const data = await getAllFoods();
        setFoods(data);
      } catch (error) {
        console.log("Error fetching foods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [showManualModal]);

  // Search filter
  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Actions
  const onAddManual = () => {
    setShowManualModal(true);
  };

  const onAddByPhoto = () => {
    console.log("Scan food photo");
  };

  // manage food function
  const onSelectFood = (food: Food) => {
    setSelectedFood(food);
    setShowEditModal(true);
  };
  const handleUpdateFood = (food: Food) => {
    console.log("Update food", food);
    setShowEditModal(false);
  };

  const handleDeleteFood = (id: number) => {
    console.log("Delete food", id);
    setShowEditModal(false);
  };

  const renderFoodItem = ({ item }: { item: Food }) => (
    <Pressable
      onPress={() => onSelectFood(item)}
      className="bg-white rounded-2xl p-4 mb-3 border border-slate-100"
    >
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-base font-semibold text-slate-900">
            {item.name}
          </Text>

          <Text className="text-xs text-slate-500 mt-1">{item.serving}</Text>
        </View>

        <View className="items-end">
          <Text className="text-sm font-bold text-slate-900">
            {item.calories} kcal
          </Text>

          <Text className="text-xs text-slate-400">
            P {item.protein}g · C {item.total_carbs}g · F {item.total_fat}g
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {loading && <LoadingOverlay text="Loading foods..." />}

      <FlatList
        data={filteredFoods}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 120,
        }}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View className="mt-4 mb-6">
              <Text className="text-[30px] font-extrabold text-slate-900">
                Manage Food
              </Text>

              <Text className="text-slate-500 mt-1">
                Create and manage your food database
              </Text>
            </View>

            {/* Search */}
            <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 mb-4 border border-slate-100">
              <Feather name="search" size={18} color="#64748b" />

              <TextInput
                placeholder="Search food..."
                value={search}
                onChangeText={setSearch}
                className="flex-1 ml-2 text-slate-900"
              />
            </View>

            {/* Actions */}
            <View className="flex-row gap-3 mb-6">
              <Pressable
                onPress={onAddManual}
                className="flex-1 flex-row items-center justify-center gap-2 bg-slate-900 rounded-2xl py-3"
              >
                <Feather name="edit-3" size={16} color="white" />

                <Text className="text-white font-semibold">Create Food</Text>
              </Pressable>

              <Pressable
                onPress={onAddByPhoto}
                className="flex-1 flex-row items-center justify-center gap-2 bg-slate-200 rounded-2xl py-3"
              >
                <Feather name="camera" size={16} color="#0f172a" />

                <Text className="font-semibold text-slate-900">Scan Photo</Text>
              </Pressable>
            </View>
          </>
        }
        renderItem={renderFoodItem}
        ListEmptyComponent={
          <View className="items-center mt-24">
            <Feather name="inbox" size={40} color="#94a3b8" />

            <Text className="text-slate-400 mt-3">No foods found</Text>
          </View>
        }
      />

      {/* Add Food Modal ===============================*/}
      <AddFoodManualModal
        visible={showManualModal}
        onClose={() => setShowManualModal(false)}
      />
      <ManageFoodModal
        visible={showEditModal}
        selectedFood={selectedFood}
        onClose={() => setShowEditModal(false)}
        onUpdate={handleUpdateFood}
        onDelete={handleDeleteFood}
      />
    </SafeAreaView>
  );
}
