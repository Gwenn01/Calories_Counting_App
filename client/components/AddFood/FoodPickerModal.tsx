// components/food/FoodPickerModal.tsx
import React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  FlatList,
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

export function FoodPickerModal({
  visible,
  onClose,
  onSelect,
  onAddManual,
  onAddByPhoto,
}: any) {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/40 justify-end">
        {loading && <LoadingOverlay text="Loading nutrition..." />}
        <View className="bg-white rounded-t-3xl px-5 pt-5 pb-8 max-h-[85%]">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-extrabold">Add Food</Text>
            <Pressable onPress={onClose}>
              <Feather name="x" size={22} />
            </Pressable>
          </View>

          {/* Search (UI only, backend later) */}
          <View className="flex-row items-center bg-slate-100 rounded-2xl px-4 mb-4">
            <Feather name="search" size={16} color="#64748b" />
            <TextInput
              placeholder="Search food (e.g. rice, chicken)"
              className="flex-1 py-3 px-3 text-base"
            />
          </View>

          {/* Quick actions */}
          <View className="flex-row gap-3 mb-4">
            <Pressable
              onPress={onAddManual}
              className="flex-1 flex-row items-center justify-center gap-2 bg-slate-900 rounded-2xl py-3"
            >
              <Feather name="edit-3" size={16} color="white" />
              <Text className="text-white font-semibold">Add Manually</Text>
            </Pressable>

            <Pressable
              onPress={onAddByPhoto}
              className="flex-1 flex-row items-center justify-center gap-2 bg-slate-200 rounded-2xl py-3"
            >
              <Feather name="camera" size={16} color="#0f172a" />
              <Text className="font-semibold text-slate-900">Scan Photo</Text>
            </Pressable>
          </View>

          {/* Food list */}
          <FlatList
            data={foods}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
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
