import {
  Modal,
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import { Food } from "../../types/foods";

interface Props {
  visible: boolean;
  selectedFood: Food | null;
  onClose: () => void;
  onUpdate: (id: number, food: Food) => void;
  onDelete: (id: number) => void;
}
// vitamins and minerals key
const mineralFields: [keyof Food, string][] = [
  ["calcium", "Calcium"],
  ["iron", "Iron"],
  ["magnesium", "Magnesium"],
  ["phosphorus", "Phosphorus"],
  ["potassium", "Potassium"],
  ["sodium", "Sodium"],
  ["zinc", "Zinc"],
  ["copper", "Copper"],
  ["manganese", "Manganese"],
];

const vitaminFields: [keyof Food, string][] = [
  ["vitamin_a", "Vitamin A"],
  ["vitamin_c", "Vitamin C"],
  ["vitamin_e", "Vitamin E"],
  ["vitamin_k", "Vitamin K"],
  ["vitamin_b1", "Vitamin B1"],
  ["vitamin_b2", "Vitamin B2"],
  ["vitamin_b3", "Vitamin B3"],
  ["vitamin_b6", "Vitamin B6"],
  ["vitamin_b9", "Vitamin B9"],
  ["vitamin_b12", "Vitamin B12"],
];

export default function ManageFoodModal({
  visible,
  selectedFood,
  onClose,
  onUpdate,
  onDelete,
}: Props) {
  const [form, setForm] = useState<Food | null>(null);

  useEffect(() => {
    if (selectedFood) {
      setForm(selectedFood);
    }
  }, [selectedFood]);

  if (!form) return null;

  const handleChange = (field: keyof Food, value: string) => {
    setForm((prev) => ({
      ...prev!,
      [field]: isNaN(Number(value)) ? value : Number(value),
    }));
  };

  const handleSave = () => {
    onUpdate(form.id, form);
  };

  const handleDelete = () => {
    onDelete(form.id);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end sm:justify-center p-4">
        <View className="bg-white rounded-[32px] w-full max-h-[90%] overflow-hidden">
          {/* Header */}
          <View className="px-6 pt-6 pb-4 border-b border-slate-100">
            <Text className="text-2xl font-extrabold text-slate-900">
              Edit Food
            </Text>
          </View>

          <ScrollView className="px-6 pt-4">
            {/* ================= GENERAL ================= */}
            <Text className="text-xs font-bold text-slate-400 uppercase mb-2">
              General
            </Text>

            <Text className="text-sm font-semibold mb-1">Food Name</Text>
            <TextInput
              value={form.name}
              onChangeText={(v) => handleChange("name", v)}
              className="bg-slate-100 rounded-xl px-4 py-3 mb-4"
            />

            <Text className="text-sm font-semibold mb-1">Serving</Text>
            <TextInput
              value={form.serving}
              onChangeText={(v) => handleChange("serving", v)}
              className="bg-slate-100 rounded-xl px-4 py-3 mb-4"
            />

            <Text className="text-sm font-semibold mb-1">Calories</Text>
            <TextInput
              keyboardType="numeric"
              value={String(form.calories)}
              onChangeText={(v) => handleChange("calories", v)}
              className="bg-slate-100 rounded-xl px-4 py-3 mb-4"
            />

            <Text className="text-sm font-semibold mb-1">Water (g)</Text>
            <TextInput
              keyboardType="numeric"
              value={String(form.water)}
              onChangeText={(v) => handleChange("water", v)}
              className="bg-slate-100 rounded-xl px-4 py-3 mb-6"
            />

            {/* ================= PROTEIN ================= */}
            <Text className="text-xs font-bold text-slate-400 uppercase mb-2">
              Protein
            </Text>

            <Text className="text-sm font-semibold mb-1">Protein (g)</Text>
            <TextInput
              keyboardType="numeric"
              value={String(form.protein)}
              onChangeText={(v) => handleChange("protein", v)}
              className="bg-slate-100 rounded-xl px-4 py-3 mb-6"
            />

            {/* ================= CARBOHYDRATES ================= */}
            <Text className="text-xs font-bold text-slate-400 uppercase mb-2">
              Carbohydrates
            </Text>

            <Text className="text-sm font-semibold mb-1">Total Carbs (g)</Text>
            <TextInput
              keyboardType="numeric"
              value={String(form.total_carbs)}
              onChangeText={(v) => handleChange("total_carbs", v)}
              className="bg-slate-100 rounded-xl px-4 py-3 mb-4"
            />

            <Text className="text-sm font-semibold mb-1">Sugars (g)</Text>
            <TextInput
              keyboardType="numeric"
              value={String(form.sugars)}
              onChangeText={(v) => handleChange("sugars", v)}
              className="bg-slate-100 rounded-xl px-4 py-3 mb-4"
            />

            <Text className="text-sm font-semibold mb-1">Fiber (g)</Text>
            <TextInput
              keyboardType="numeric"
              value={String(form.fiber)}
              onChangeText={(v) => handleChange("fiber", v)}
              className="bg-slate-100 rounded-xl px-4 py-3 mb-4"
            />

            <Text className="text-sm font-semibold mb-1">Starch (g)</Text>
            <TextInput
              keyboardType="numeric"
              value={String(form.starch)}
              onChangeText={(v) => handleChange("starch", v)}
              className="bg-slate-100 rounded-xl px-4 py-3 mb-6"
            />

            {/* ================= FATS ================= */}
            <Text className="text-xs font-bold text-slate-400 uppercase mb-2">
              Fats & Cholesterol
            </Text>

            <Text className="text-sm font-semibold mb-1">Total Fat (g)</Text>
            <TextInput
              keyboardType="numeric"
              value={String(form.total_fat)}
              onChangeText={(v) => handleChange("total_fat", v)}
              className="bg-slate-100 rounded-xl px-4 py-3 mb-4"
            />

            <Text className="text-sm font-semibold mb-1">
              Saturated Fat (g)
            </Text>
            <TextInput
              keyboardType="numeric"
              value={String(form.saturated_fat)}
              onChangeText={(v) => handleChange("saturated_fat", v)}
              className="bg-slate-100 rounded-xl px-4 py-3 mb-4"
            />

            <Text className="text-sm font-semibold mb-1">
              Monounsaturated Fat (g)
            </Text>
            <TextInput
              keyboardType="numeric"
              value={String(form.monounsaturated_fat)}
              onChangeText={(v) => handleChange("monounsaturated_fat", v)}
              className="bg-slate-100 rounded-xl px-4 py-3 mb-4"
            />

            <Text className="text-sm font-semibold mb-1">
              Polyunsaturated Fat (g)
            </Text>
            <TextInput
              keyboardType="numeric"
              value={String(form.polyunsaturated_fat)}
              onChangeText={(v) => handleChange("polyunsaturated_fat", v)}
              className="bg-slate-100 rounded-xl px-4 py-3 mb-4"
            />

            <Text className="text-sm font-semibold mb-1">Trans Fat (g)</Text>
            <TextInput
              keyboardType="numeric"
              value={String(form.trans_fat)}
              onChangeText={(v) => handleChange("trans_fat", v)}
              className="bg-slate-100 rounded-xl px-4 py-3 mb-4"
            />

            <Text className="text-sm font-semibold mb-1">Cholesterol (mg)</Text>
            <TextInput
              keyboardType="numeric"
              value={String(form.cholesterol)}
              onChangeText={(v) => handleChange("cholesterol", v)}
              className="bg-slate-100 rounded-xl px-4 py-3 mb-6"
            />

            {/* ================= VITAMINS ================= */}
            <Text className="text-xs font-bold text-slate-400 uppercase mb-2">
              Vitamins
            </Text>

            {vitaminFields.map(([key, label]) => (
              <View key={key}>
                <Text className="text-sm font-semibold mb-1">{label}</Text>

                <TextInput
                  keyboardType="numeric"
                  value={String(form[key] ?? 0)}
                  onChangeText={(v) => handleChange(key, v)}
                  className="bg-slate-100 rounded-xl px-4 py-3 mb-4"
                />
              </View>
            ))}

            {/* ================= MINERALS ================= */}
            <Text className="text-xs font-bold text-slate-400 uppercase mb-2">
              Minerals
            </Text>

            {mineralFields.map(([key, label]) => (
              <View key={key}>
                <Text className="text-sm font-semibold mb-1">{label} (mg)</Text>

                <TextInput
                  keyboardType="numeric"
                  value={String(form[key] ?? 0)}
                  onChangeText={(v) => handleChange(key, v)}
                  className="bg-slate-100 rounded-xl px-4 py-3 mb-4"
                />
              </View>
            ))}
          </ScrollView>

          {/* Footer Buttons */}
          <View className="flex-row gap-3 p-4 border-t border-slate-100">
            <Pressable
              onPress={handleSave}
              className="flex-1 bg-emerald-500 py-4 rounded-full"
            >
              <Text className="text-center text-white font-bold">Save</Text>
            </Pressable>
            {/* Delete */}
            <Pressable
              onPress={handleDelete}
              className="flex-1 bg-red-500 py-4 rounded-full"
            >
              <Text className="text-center text-white font-bold">Delete</Text>
            </Pressable>

            {/* Save */}
          </View>

          {/* Close */}
          <Pressable onPress={onClose} className="pb-4">
            <Text className="text-center text-slate-400">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
