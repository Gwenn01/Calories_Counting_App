// components/food/FoodPickerModal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  FlatList,
  Keyboard,
  KeyboardEvent,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import LoadingOverlay from "@/components/LoadingOverplay";
import { getAllFoods } from "../../api/food";

interface Food {
  id: number;
  name: string;
  serving: string;
  calories: number;
  protein: number;
  total_carbs: number;
  total_fat: number;
}

export function FoodPickerModal({ visible, onClose, onSelect }: any) {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e: KeyboardEvent) =>
      setKeyboardHeight(e.endCoordinates.height),
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardHeight(0),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

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

    if (visible) {
      fetchFoods();
    }
  }, [visible]);

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/40 justify-end">
        {loading && <LoadingOverlay text="Loading foods..." />}
        <View
          className="bg-white rounded-t-3xl px-5 pt-5 max-h-[85%]"
          style={{ paddingBottom: keyboardHeight || 32 }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-extrabold">Add Food</Text>
            <Pressable onPress={onClose}>
              <Feather name="x" size={22} />
            </Pressable>
          </View>

          {/* Search */}
          <View className="flex-row items-center bg-slate-100 rounded-2xl px-4 mb-4">
            <Feather name="search" size={16} color="#64748b" />
            <TextInput
              placeholder="Search food (e.g. rice, chicken)"
              className="flex-1 py-3 px-3 text-base"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Food list */}
          <FlatList
            data={filteredFoods}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => onSelect(item)}
                className="py-4 border-b border-slate-100"
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-base font-semibold">{item.name}</Text>
                    <Text className="text-xs text-slate-500">
                      {item.serving}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-sm font-bold">
                      {item.calories} kcal
                    </Text>
                    <Text className="text-xs text-slate-400">
                      P {item.protein}g · C {item.total_carbs}g · F{" "}
                      {item.total_fat}g
                    </Text>
                  </View>
                </View>
              </Pressable>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}
