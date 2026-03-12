import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";

interface Profile {
  name: string;
  age: number;
  weight: number;
  height: number;
  target_calories: number;
  target_protein: number;
  target_carbs: number;
  target_fats: number;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  profile: Profile;
  onSave: (data: Profile) => void;
}

export default function EditProfileModal({
  visible,
  onClose,
  profile,
  onSave,
}: Props) {
  const [form, setForm] = useState<Profile>(profile);

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  const updateField = (key: keyof Profile, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: key === "name" ? value : Number(value) || 0,
    }));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-white rounded-t-3xl px-5 pt-6 pb-10 max-h-[90%]">
          <Text className="text-xl font-extrabold mb-5">Edit Profile</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Age */}
            <Input
              label="Age"
              value={String(form.age)}
              keyboard="numeric"
              onChange={(v: string) => updateField("age", v)}
            />

            {/* Weight */}
            <Input
              label="Weight (kg)"
              value={String(form.weight)}
              keyboard="numeric"
              onChange={(v: string) => updateField("weight", v)}
            />

            {/* Height */}
            <Input
              label="Height (cm)"
              value={String(form.height)}
              keyboard="numeric"
              onChange={(v: string) => updateField("height", v)}
            />

            {/* Calories */}
            <Input
              label="Daily Calories"
              value={String(form.target_calories)}
              keyboard="numeric"
              onChange={(v: string) => updateField("target_calories", v)}
            />

            {/* Protein */}
            <Input
              label="Protein Goal (g)"
              value={String(form.target_protein)}
              keyboard="numeric"
              onChange={(v: string) => updateField("target_protein", v)}
            />

            {/* Carbs */}
            <Input
              label="Carbs Goal (g)"
              value={String(form.target_carbs)}
              keyboard="numeric"
              onChange={(v: string) => updateField("target_carbs", v)}
            />

            {/* Fats */}
            <Input
              label="Fats Goal (g)"
              value={String(form.target_fats)}
              keyboard="numeric"
              onChange={(v: string) => updateField("target_fats", v)}
            />
          </ScrollView>

          {/* Buttons */}
          <View className="flex-row gap-3 mt-6">
            <Pressable
              onPress={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-200"
            >
              <Text className="text-center font-semibold">Cancel</Text>
            </Pressable>

            <Pressable
              onPress={() => onSave(form)}
              className="flex-1 py-3 rounded-xl bg-emerald-500"
            >
              <Text className="text-center text-white font-semibold">Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ---------- Small Input Component ---------- */

function Input({ label, value, onChange, keyboard = "default" }: any) {
  return (
    <View className="mb-4">
      <Text className="text-sm text-slate-500 mb-1">{label}</Text>

      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboard}
        className="border border-slate-200 rounded-xl px-4 py-3 text-base"
      />
    </View>
  );
}
