// components/food/FoodPickerModal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
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

  useEffect(() => {
    if (!visible) return;
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
  }, [visible]);

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
    >
      {/* ✅ KeyboardAvoidingView now correctly wraps all modal content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View className="flex-1 bg-black/50 justify-end">
          {loading && <LoadingOverlay text="Loading foods..." />}

          {/* Sheet */}
          <View className="bg-white rounded-t-[32px] px-5 pt-4 max-h-[88%]">
            {/* Drag handle */}
            <View className="self-center w-10 h-1 rounded-full bg-slate-200 mb-5" />

            {/* Header */}
            <View className="flex-row items-center justify-between mb-5">
              <View>
                <Text className="text-2xl font-black tracking-tight text-slate-900">
                  Add Food
                </Text>
                <Text className="text-xs text-slate-400 mt-0.5">
                  {filteredFoods.length} items available
                </Text>
              </View>
              <Pressable
                onPress={onClose}
                className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
              >
                <Feather name="x" size={16} color="#334155" />
              </Pressable>
            </View>

            {/* Search */}
            <View className="flex-row items-center bg-slate-100 rounded-2xl px-4 mb-5 h-12">
              <Feather name="search" size={16} color="#94a3b8" />
              <TextInput
                placeholder="Search food…"
                placeholderTextColor="#94a3b8"
                className="flex-1 py-3 px-3 text-sm text-slate-800"
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <Pressable onPress={() => setSearch("")}>
                  <Feather name="x-circle" size={16} color="#94a3b8" />
                </Pressable>
              )}
            </View>

            {/* Food List */}
            <FlatList
              data={filteredFoods}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              contentContainerStyle={{ paddingBottom: 36 }}
              ListEmptyComponent={
                !loading ? (
                  <View className="items-center py-16">
                    <Feather name="inbox" size={32} color="#cbd5e1" />
                    <Text className="text-slate-400 text-sm mt-3">
                      No foods found
                    </Text>
                  </View>
                ) : null
              }
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => onSelect(item)}
                  android_ripple={{ color: "#f1f5f9" }}
                  className="py-4 border-b border-slate-50 active:bg-slate-50"
                >
                  <View className="flex-row justify-between items-center">
                    {/* Left: name + serving */}
                    <View className="flex-1 mr-4">
                      <Text
                        className="text-sm font-bold text-slate-800"
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      <Text className="text-xs text-slate-400 mt-0.5">
                        {item.serving}
                      </Text>
                    </View>

                    {/* Right: calories + macros */}
                    <View className="items-end">
                      <View className="bg-emerald-50 px-2.5 py-1 rounded-lg mb-1">
                        <Text className="text-xs font-black text-emerald-600">
                          {item.calories} kcal
                        </Text>
                      </View>
                      <Text className="text-[10px] text-slate-400 font-medium">
                        P{item.protein}g · C{item.total_carbs}g · F
                        {item.total_fat}g
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
