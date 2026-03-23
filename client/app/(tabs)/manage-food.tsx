import { useState, useEffect, useCallback, useMemo, memo } from "react";
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
import { BarcodeScannerModal } from "@/components/ManageFood/BarcodeScannerModal";
import { FoodPhotoModal } from "@/components/ManageFood/FoodPhotoModal";
// apis
import { getAllFoods, updateFood, deleteFood } from "@/api/food";
import { Food } from "../../types/foods";

// ─── Memoized FoodItem to prevent re-renders ─────────────────────
const MemoFoodItem = memo(function MemoFoodItem({
  item,
  onPress,
}: {
  item: Food;
  onPress: (food: Food) => void;
}) {
  return <FoodItem item={item} onPress={onPress} />;
});

// ─── Empty component defined outside to prevent re-renders ───────
const EmptyComponent = () => (
  <View className="items-center mt-24">
    <Feather name="inbox" size={40} color="#94a3b8" />
    <Text className="text-slate-400 mt-3">No foods found</Text>
  </View>
);

export default function ManageFoodScreen() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [foods, setFoods] = useState<Food[]>([]);
  const [totalFoods, setTotalFoods] = useState(0);
  const [search, setSearch] = useState("");
  const [showManualModal, setShowManualModal] = useState(false);
  const [showFoodBot, setShowFoodBot] = useState(false);
  const [showBarcode, setShowBarcode] = useState(false);
  const [showPhotoScan, setShowPhotoScan] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchFoods = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchFoods();
  }, [showManualModal, showEditModal]);

  // useMemo — only re-filters when foods or search changes
  const filteredFoods = useMemo(
    () =>
      foods.filter((food) =>
        food.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [foods, search],
  );

  // useCallback — stable references prevent re-renders
  const onAddManual = useCallback(() => setShowManualModal(true), []);
  const onFoodBot = useCallback(() => setShowFoodBot(true), []);
  const onScanBarcode = useCallback(() => setShowBarcode(true), []);
  const onAddByPhoto = useCallback(() => setShowPhotoScan(true), []);

  const onSelectFood = useCallback((food: Food) => {
    setSelectedFood(food);
    setShowEditModal(true);
  }, []);

  const sanitizeFood = useCallback((form: Food) => {
    const payload: any = {};
    for (const key in form) {
      const value = form[key as keyof Food];
      if (key === "name" || key === "serving") {
        payload[key] = value || "";
        continue;
      }
      payload[key] = value === "" ? 0 : Number(value);
    }
    return payload;
  }, []);

  const handleUpdateFood = useCallback(
    async (id: number, food: Food) => {
      try {
        setShowEditModal(false);
        setLoading(true);
        const payload = sanitizeFood(food);
        await updateFood(id, payload);
        showToast("Success!", "Food updated successfully", "success");
        await fetchFoods();
      } catch {
        showToast("Error", "Error updating food", "error");
      } finally {
        setLoading(false);
      }
    },
    [sanitizeFood, fetchFoods],
  );

  const handleDeleteFood = useCallback(
    async (id: number) => {
      try {
        setShowEditModal(false);
        setLoading(true);
        await deleteFood(id);
        showToast("Success!", "Food deleted successfully", "success");
        await fetchFoods();
      } catch {
        showToast("Error", "Error deleting food", "error");
      } finally {
        setLoading(false);
      }
    },
    [fetchFoods],
  );

  const renderItem = useCallback(
    ({ item }: { item: Food }) => (
      <MemoFoodItem item={item} onPress={onSelectFood} />
    ),
    [onSelectFood],
  );

  const keyExtractor = useCallback((item: Food) => item.id.toString(), []);

  // Memoized header to prevent re-render on every keystroke
  const ListHeader = useMemo(
    () => (
      <FoodListHeader
        totalFoods={totalFoods}
        search={search}
        onSearchChange={setSearch}
        onAddManual={onAddManual}
        onFoodBot={onFoodBot}
        onScanBarcode={onScanBarcode}
        onAddByPhoto={onAddByPhoto}
      />
    ),
    [totalFoods, search, onAddManual, onFoodBot, onScanBarcode, onAddByPhoto],
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {loading && <LoadingOverlay text="Loading foods..." />}

      <FlatList
        data={filteredFoods}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={EmptyComponent}
        // ─── Performance props ───────────────────────────────
        removeClippedSubviews={true} // unmount off-screen items
        maxToRenderPerBatch={10} // render 10 items at a time
        initialNumToRender={10} // only render 10 on first load
        windowSize={5} // keep 5 screens worth in memory
        scrollEventThrottle={16} // smooth 60fps scroll events
        getItemLayout={undefined} // add this if all items same height
      />

      {/* Modals outside FlatList */}
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
      <BarcodeScannerModal
        visible={showBarcode}
        onClose={() => setShowBarcode(false)}
      />
      <FoodPhotoModal
        visible={showPhotoScan}
        onClose={() => setShowPhotoScan(false)}
      />
    </SafeAreaView>
  );
}
