import {
  Modal,
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";

interface Food {
  id: number;
  name: string;
  serving: string;
  calories: number;
  protein: number;
  total_carbs: number;
  total_fat: number;
}

interface Props {
  visible: boolean;
  selectedFood: Food | null;
  onClose: () => void;
  onUpdate: (food: Food) => void;
  onDelete: (id: number) => void;
}

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
    setForm({
      ...form,
      [field]: field === "name" || field === "serving" ? value : Number(value),
    });
  };

  const handleSave = () => {
    onUpdate(form);
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
            {/* Name */}
            <Text className="text-sm font-semibold mb-1">Food Name</Text>
            <TextInput
              value={form.name}
              onChangeText={(v) => handleChange("name", v)}
              className="bg-slate-100 rounded-xl px-4 py-3 mb-4"
            />

            {/* Serving */}
            <Text className="text-sm font-semibold mb-1">Serving</Text>
            <TextInput
              value={form.serving}
              onChangeText={(v) => handleChange("serving", v)}
              className="bg-slate-100 rounded-xl px-4 py-3 mb-4"
            />

            {/* Calories */}
            <Text className="text-sm font-semibold mb-1">Calories</Text>
            <TextInput
              keyboardType="numeric"
              value={String(form.calories)}
              onChangeText={(v) => handleChange("calories", v)}
              className="bg-slate-100 rounded-xl px-4 py-3 mb-4"
            />

            {/* Protein */}
            <Text className="text-sm font-semibold mb-1">Protein (g)</Text>
            <TextInput
              keyboardType="numeric"
              value={String(form.protein)}
              onChangeText={(v) => handleChange("protein", v)}
              className="bg-slate-100 rounded-xl px-4 py-3 mb-4"
            />

            {/* Carbs */}
            <Text className="text-sm font-semibold mb-1">
              Carbohydrates (g)
            </Text>
            <TextInput
              keyboardType="numeric"
              value={String(form.total_carbs)}
              onChangeText={(v) => handleChange("total_carbs", v)}
              className="bg-slate-100 rounded-xl px-4 py-3 mb-4"
            />

            {/* Fat */}
            <Text className="text-sm font-semibold mb-1">Fat (g)</Text>
            <TextInput
              keyboardType="numeric"
              value={String(form.total_fat)}
              onChangeText={(v) => handleChange("total_fat", v)}
              className="bg-slate-100 rounded-xl px-4 py-3 mb-6"
            />
          </ScrollView>

          {/* Footer Buttons */}
          <View className="flex-row gap-3 p-4 border-t border-slate-100">
            {/* Delete */}
            <Pressable
              onPress={handleDelete}
              className="flex-1 bg-red-500 py-4 rounded-full"
            >
              <Text className="text-center text-white font-bold">Delete</Text>
            </Pressable>

            {/* Save */}
            <Pressable
              onPress={handleSave}
              className="flex-1 bg-emerald-500 py-4 rounded-full"
            >
              <Text className="text-center text-white font-bold">Save</Text>
            </Pressable>
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
