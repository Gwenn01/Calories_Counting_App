import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";

type FitnessProfile = {
  weight_unit: "kg" | "lbs";
  default_rest_time: number;
  experience_level: "beginner" | "intermediate" | "advanced";
  progression_type: "linear" | "double" | "percentage" | "rpe";
  progression_increment_kg: number;
  progression_increment_lbs: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FitnessProfile) => void;
  initialData?: FitnessProfile | null;
};

export default function FitnessProfileModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}: Props) {
  const [form, setForm] = useState<FitnessProfile>({
    weight_unit: "kg",
    default_rest_time: 90,
    experience_level: "beginner",
    progression_type: "double",
    progression_increment_kg: 2.5,
    progression_increment_lbs: 5.0,
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (name: keyof FitnessProfile, value: string | number) => {
    setForm({ ...form, [name]: value } as FitnessProfile);
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent>
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-white rounded-t-3xl px-5 pt-6 pb-10 max-h-[90%]">
          <Text className="text-xl font-extrabold mb-5">
            {initialData ? "Edit Fitness Profile" : "Create Fitness Profile"}
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Weight Unit */}
            <View className="mb-4">
              <Text className="text-sm text-slate-500 mb-1">Weight Unit</Text>
              <View className="flex-row">
                {(["kg", "lbs"] as const).map((unit, i) => (
                  <Pressable
                    key={unit}
                    onPress={() => handleChange("weight_unit", unit)}
                    className={`flex-1 py-3 rounded-xl border items-center ${
                      i === 0 ? "mr-2" : ""
                    } ${
                      form.weight_unit === unit
                        ? "bg-emerald-50 border-emerald-500"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        form.weight_unit === unit
                          ? "text-emerald-600"
                          : "text-slate-400"
                      }`}
                    >
                      {unit.toUpperCase()}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Rest Time */}
            <Input
              label="Default Rest Time (sec)"
              value={String(form.default_rest_time)}
              keyboard="numeric"
              onChange={(v: string) =>
                handleChange("default_rest_time", Number(v) || 0)
              }
            />

            {/* Experience Level */}
            <View className="mb-4">
              <Text className="text-sm text-slate-500 mb-1">
                Experience Level
              </Text>
              <View className="flex-row">
                {(["beginner", "intermediate", "advanced"] as const).map(
                  (level, i) => (
                    <Pressable
                      key={level}
                      onPress={() => handleChange("experience_level", level)}
                      className={`flex-1 py-3 rounded-xl border items-center ${
                        i < 2 ? "mr-2" : ""
                      } ${
                        form.experience_level === level
                          ? "bg-emerald-50 border-emerald-500"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      <Text
                        className={`font-semibold text-xs ${
                          form.experience_level === level
                            ? "text-emerald-600"
                            : "text-slate-400"
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Text>
                    </Pressable>
                  ),
                )}
              </View>
            </View>

            {/* Progression Type */}
            <View className="mb-4">
              <Text className="text-sm text-slate-500 mb-1">
                Progression Type
              </Text>
              <View className="flex-row flex-wrap">
                {(["linear", "double", "percentage", "rpe"] as const).map(
                  (type, i) => (
                    <Pressable
                      key={type}
                      onPress={() => handleChange("progression_type", type)}
                      className={`py-3 px-4 rounded-xl border items-center mb-2 ${
                        i % 2 === 0 ? "mr-2" : ""
                      } ${
                        form.progression_type === type
                          ? "bg-emerald-50 border-emerald-500"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      <Text
                        className={`font-semibold text-xs ${
                          form.progression_type === type
                            ? "text-emerald-600"
                            : "text-slate-400"
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </Pressable>
                  ),
                )}
              </View>
            </View>

            {/* Progression Increment KG */}
            <Input
              label="Progression Increment (kg)"
              value={String(form.progression_increment_kg)}
              keyboard="numeric"
              onChange={(v: string) =>
                handleChange("progression_increment_kg", Number(v) || 0)
              }
            />

            {/* Progression Increment LBS */}
            <Input
              label="Progression Increment (lbs)"
              value={String(form.progression_increment_lbs)}
              keyboard="numeric"
              onChange={(v: string) =>
                handleChange("progression_increment_lbs", Number(v) || 0)
              }
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
              onPress={() => onSubmit(form)}
              className="flex-1 py-3 rounded-xl bg-emerald-500"
            >
              <Text className="text-center text-white font-semibold">
                {initialData ? "Save" : "Get Started"}
              </Text>
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
