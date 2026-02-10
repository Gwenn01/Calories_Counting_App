import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";

export function AddFoodManualModal({ visible, onClose }: any) {
  const [form, setForm] = useState({
    name: "",
    serving: "",
    calories: "",
    protein: "",
    total_carbs: "",
    total_fat: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      calories: Number(form.calories),
      protein: Number(form.protein),
      total_carbs: Number(form.total_carbs),
      total_fat: Number(form.total_fat),
    };

    try {
      console.log("Submitting:", payload);
      alert("Food added!");
      onClose(); // ✅ close modal after save
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      {/* Overlay */}
      <View className="flex-1 bg-black/40 justify-end">
        {/* Bottom Sheet */}
        <View className="bg-white rounded-t-3xl max-h-[90%] p-5">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">Add Food Manually</Text>
            <Pressable onPress={onClose}>
              <Feather name="x" size={22} color="#64748b" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <TextInput
              placeholder="Food name"
              onChangeText={(v) => handleChange("name", v)}
              className="border border-slate-200 p-4 mb-3 rounded-xl"
            />
            <TextInput
              placeholder="Serving (e.g. 1 pack 300ml)"
              onChangeText={(v) => handleChange("serving", v)}
              className="border border-slate-200 p-4 mb-3 rounded-xl"
            />

            <TextInput
              placeholder="Calories"
              keyboardType="numeric"
              onChangeText={(v) => handleChange("calories", v)}
              className="border border-slate-200 p-4 mb-3 rounded-xl"
            />
            <TextInput
              placeholder="Protein (g)"
              keyboardType="numeric"
              onChangeText={(v) => handleChange("protein", v)}
              className="border border-slate-200 p-4 mb-3 rounded-xl"
            />
            <TextInput
              placeholder="Carbs (g)"
              keyboardType="numeric"
              onChangeText={(v) => handleChange("total_carbs", v)}
              className="border border-slate-200 p-4 mb-3 rounded-xl"
            />
            <TextInput
              placeholder="Fat (g)"
              keyboardType="numeric"
              onChangeText={(v) => handleChange("total_fat", v)}
              className="border border-slate-200 p-4 mb-6 rounded-xl"
            />
          </ScrollView>

          {/* Save button */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-black py-4 rounded-xl"
          >
            <Text className="text-white text-center font-semibold text-base">
              Save Food
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
