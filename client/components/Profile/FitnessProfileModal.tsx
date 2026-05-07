import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";

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

const FIELD_META: Record<
  string,
  { icon: string; color: string; bg: string; border: string }
> = {
  default_rest_time: {
    icon: "clock",
    color: "#f97316",
    bg: "#fff7ed",
    border: "#ffedd5",
  },
  progression_increment_kg: {
    icon: "activity",
    color: "#ec4899",
    bg: "#fdf2f8",
    border: "#fce7f3",
  },
  progression_increment_lbs: {
    icon: "activity",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fef3c7",
  },
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
    if (initialData) setForm(initialData);
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
            {/* ── Preferences ── */}
            <View
              className="rounded-[20px] p-4 mb-4"
              style={{
                borderWidth: 1,
                borderColor: "#f1f5f9",
                backgroundColor: "#f8fafc",
              }}
            >
              <Text className="text-[10px] font-bold tracking-widest text-slate-300 uppercase mb-3">
                Preferences
              </Text>

              {/* Weight Unit */}
              <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">
                Weight Unit
              </Text>
              <View className="flex-row mb-4">
                {(["kg", "lbs"] as const).map((unit, i) => (
                  <Pressable
                    key={unit}
                    onPress={() => handleChange("weight_unit", unit)}
                    className={`flex-1 py-3 rounded-xl border items-center ${i === 0 ? "mr-2" : ""} ${
                      form.weight_unit === unit
                        ? "bg-emerald-50 border-emerald-400"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <Text
                      className={`font-bold text-sm ${
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

              {/* Rest Time */}
              <IconInput
                fieldKey="default_rest_time"
                label="Default Rest Time"
                value={String(form.default_rest_time)}
                unit="sec"
                keyboard="numeric"
                onChange={(v) =>
                  handleChange("default_rest_time", Number(v) || 0)
                }
              />
            </View>

            {/* ── Training Config ── */}
            <View
              className="rounded-[20px] p-4 mb-4"
              style={{
                borderWidth: 1,
                borderColor: "#f1f5f9",
                backgroundColor: "#f8fafc",
              }}
            >
              <Text className="text-[10px] font-bold tracking-widest text-slate-300 uppercase mb-3">
                Training Config
              </Text>

              {/* Experience Level */}
              <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">
                Experience Level
              </Text>
              <View className="flex-row mb-4">
                {(["beginner", "intermediate", "advanced"] as const).map(
                  (level, i) => (
                    <Pressable
                      key={level}
                      onPress={() => handleChange("experience_level", level)}
                      className={`flex-1 py-3 rounded-xl border items-center ${i < 2 ? "mr-2" : ""} ${
                        form.experience_level === level
                          ? "bg-emerald-50 border-emerald-400"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      <Text
                        className={`font-bold text-xs ${
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

              {/* Progression Type */}
              <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">
                Progression Type
              </Text>
              <View className="flex-row flex-wrap mb-1">
                {(["linear", "double", "percentage", "rpe"] as const).map(
                  (type, i) => (
                    <Pressable
                      key={type}
                      onPress={() => handleChange("progression_type", type)}
                      className={`py-3 px-4 rounded-xl border items-center mb-2 ${i % 2 === 0 ? "mr-2" : ""} ${
                        form.progression_type === type
                          ? "bg-emerald-50 border-emerald-400"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      <Text
                        className={`font-bold text-xs ${
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

            {/* ── Progression Increments ── */}
            <View
              className="rounded-[20px] p-4 mb-4"
              style={{
                borderWidth: 1,
                borderColor: "#f1f5f9",
                backgroundColor: "#f8fafc",
              }}
            >
              <Text className="text-[10px] font-bold tracking-widest text-slate-300 uppercase mb-3">
                Progression Increments
              </Text>

              <IconInput
                fieldKey="progression_increment_kg"
                label="Increment (kg)"
                value={String(form.progression_increment_kg)}
                unit="kg"
                keyboard="numeric"
                onChange={(v) =>
                  handleChange("progression_increment_kg", Number(v) || 0)
                }
              />
              <IconInput
                fieldKey="progression_increment_lbs"
                label="Increment (lbs)"
                value={String(form.progression_increment_lbs)}
                unit="lbs"
                keyboard="numeric"
                onChange={(v) =>
                  handleChange("progression_increment_lbs", Number(v) || 0)
                }
              />
            </View>
          </ScrollView>

          {/* Buttons */}
          <View className="flex-row gap-3 mt-4">
            <Pressable
              onPress={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-100"
            >
              <Text className="text-center font-semibold text-slate-500">
                Cancel
              </Text>
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

/* ── IconInput ── */
function IconInput({
  fieldKey,
  label,
  value,
  unit,
  onChange,
  keyboard = "default",
}: {
  fieldKey: string;
  label: string;
  value: string;
  unit?: string;
  onChange: (v: string) => void;
  keyboard?: string;
}) {
  const FIELD_META: Record<
    string,
    { icon: string; color: string; bg: string; border: string }
  > = {
    default_rest_time: {
      icon: "clock",
      color: "#f97316",
      bg: "#fff7ed",
      border: "#ffedd5",
    },
    progression_increment_kg: {
      icon: "activity",
      color: "#ec4899",
      bg: "#fdf2f8",
      border: "#fce7f3",
    },
    progression_increment_lbs: {
      icon: "activity",
      color: "#f59e0b",
      bg: "#fffbeb",
      border: "#fef3c7",
    },
  };

  const meta = FIELD_META[fieldKey] ?? {
    icon: "edit",
    color: "#64748b",
    bg: "#f8fafc",
    border: "#e2e8f0",
  };

  return (
    <View className="flex-row items-center mb-3">
      {/* Icon chip */}
      <View
        className="w-9 h-9 rounded-[11px] items-center justify-center mr-3"
        style={{
          backgroundColor: meta.bg,
          borderWidth: 1,
          borderColor: meta.border,
          shadowColor: meta.color,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Feather name={meta.icon as any} size={14} color={meta.color} />
      </View>

      {/* Label + Input */}
      <View className="flex-1">
        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
          {label}
        </Text>
        <View className="flex-row items-center border border-slate-200 rounded-xl px-3 py-2 bg-white">
          <TextInput
            value={value}
            onChangeText={onChange}
            keyboardType={keyboard as any}
            className="flex-1 text-slate-800 font-semibold text-sm"
            style={{ padding: 0 }}
          />
          {unit && (
            <Text className="text-slate-400 text-xs font-bold ml-1">
              {unit}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
