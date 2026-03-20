import { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
// components
import { useToast } from "@/components/ToastProvider";
import { FoodItem } from "@/components/ManageFood/FoodItem";
import { FoodListHeader } from "@/components/ManageFood/FoodListHeader";
import LoadingOverlay from "@/components/LoadingOverplay";
import { AddFoodManualModal } from "@/components/ManageFood/AddFoodManualModal";
import ManageFoodModal from "@/components/ManageFood/ManageFoodModal";
import { FoodBotModal } from "@/components/ManageFood/FoodBotModal";
// apis
import { getAllFoods, updateFood, deleteFood } from "@/api/food";
import { Food } from "../../types/foods";

export default function ManageFoodScreen() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [foods, setFoods] = useState<Food[]>([]);
  const [totalFoods, setTotalFoods] = useState(0);
  const [search, setSearch] = useState("");
  const [showManualModal, setShowManualModal] = useState(false);
  const [showFoodBot, setShowFoodBot] = useState(false);
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
        setTotalFoods(data.length);
      } catch (error) {
        console.log("Error fetching foods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [showManualModal, showEditModal]);

  // Search filter ================================================================
  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Actions ======================================================================
  const onAddManual = () => {
    setShowManualModal(true);
  };
  const onFoodBot = () => {
    setShowFoodBot(true);
  };
  const onAddByPhoto = () => {
    console.log("Scan food photo");
  };
  const onScanBarcode = () => {
    console.log("Scan food barcode");
  };

  // MAIN function ========================================================
  const onSelectFood = (food: Food) => {
    setSelectedFood(food);
    setShowEditModal(true);
  };
  // format the data before passing to backend ===================================
  function sanitizeFood(form: Food) {
    const payload: any = {};

    for (const key in form) {
      const value = form[key as keyof Food];
      // keep string fields
      if (key === "name" || key === "serving") {
        payload[key] = value || "";
        continue;
      }
      // convert numeric fields
      payload[key] = value === "" ? 0 : Number(value);
    }

    return payload;
  }
  // FOOD UPDATE AND DELETE FUNCTIONS ==================================================
  const handleUpdateFood = async (id: number, food: Food) => {
    try {
      setShowEditModal(false);
      setLoading(true);
      const payload = sanitizeFood(food);
      await updateFood(id, payload);
      showToast("Success!", "Food updated successfully", "success");
    } catch (error) {
      console.log(error);
      showToast("Error", "Error deleting food", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFood = async (id: number) => {
    try {
      setShowEditModal(false);
      setLoading(true);
      await deleteFood(id);
      showToast("Success!", "Food deleted successfully", "success");
    } catch (error) {
      console.log("Error deleting food:", error);
      showToast("Error", "Error deleting food", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {loading && <LoadingOverlay text="Loading foods..." />}

      {/* HEADER FIElD ========================================== */}
      <FlatList
        data={filteredFoods}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        ListHeaderComponent={
          <FoodListHeader
            totalFoods={totalFoods}
            search={search}
            onSearchChange={setSearch}
            onAddManual={onAddManual}
            onFoodBot={onFoodBot}
            onScanBarcode={onScanBarcode}
            onAddByPhoto={onAddByPhoto}
          />
        }
        renderItem={({ item }) => (
          <FoodItem item={item} onPress={onSelectFood} />
        )}
        ListEmptyComponent={
          <View className="items-center mt-24">
            <Feather name="inbox" size={40} color="#94a3b8" />
            <Text className="text-slate-400 mt-3">No foods found</Text>
          </View>
        }
      />

      {/* MODAL SECTION ADD FOOD ===============================*/}
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
      <FoodBotModal
        visible={showFoodBot}
        onClose={() => setShowFoodBot(false)}
      />
    </SafeAreaView>
  );
}
