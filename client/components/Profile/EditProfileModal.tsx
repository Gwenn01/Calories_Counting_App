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

const FIELD_META: Record<
  string,
  { icon: string; color: string; bg: string; border: string }
> = {
  age: { icon: "user", color: "#8b5cf6", bg: "#f5f3ff", border: "#ede9fe" },
  weight: {
    icon: "activity",
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#dbeafe",
  },
  height: {
    icon: "maximize-2",
    color: "#f97316",
    bg: "#fff7ed",
    border: "#ffedd5",
  },
  target_calories: {
    icon: "zap",
    color: "#10b981",
    bg: "#f0fdf4",
    border: "#dcfce7",
  },
  target_protein: {
    icon: "zap",
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#dbeafe",
  },
  target_carbs: {
    icon: "sun",
    color: "#f97316",
    bg: "#fff7ed",
    border: "#ffedd5",
  },
  target_fats: {
    icon: "droplet",
    color: "#ec4899",
    bg: "#fdf2f8",
    border: "#fce7f3",
  },
};

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
            {/* ── BODY METRICS ── */}
            <View
              className="rounded-[20px] p-4 mb-4"
              style={{
                borderWidth: 1,
                borderColor: "#f1f5f9",
                backgroundColor: "#f8fafc",
              }}
            >
              <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">
                Body Metrics
              </Text>

              <IconInput
                fieldKey="age"
                label="Age"
                value={String(form.age)}
                unit="yrs"
                keyboard="numeric"
                onChange={(v) => updateField("age", v)}
              />
              <IconInput
                fieldKey="weight"
                label="Weight"
                value={String(form.weight)}
                unit="kg"
                keyboard="numeric"
                onChange={(v) => updateField("weight", v)}
              />
              <IconInput
                fieldKey="height"
                label="Height"
                value={String(form.height)}
                unit="cm"
                keyboard="numeric"
                onChange={(v) => updateField("height", v)}
              />
            </View>

            {/* ── MACRONUTRIENT GOALS ── */}
            <View
              className="rounded-[20px] p-4 mb-4"
              style={{
                borderWidth: 1,
                borderColor: "#f1f5f9",
                backgroundColor: "#f8fafc",
              }}
            >
              <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">
                Macronutrient Goals
              </Text>

              <IconInput
                fieldKey="target_calories"
                label="Daily Calories"
                value={String(form.target_calories)}
                unit="kcal"
                keyboard="numeric"
                onChange={(v) => updateField("target_calories", v)}
              />
              <IconInput
                fieldKey="target_protein"
                label="Protein Goal"
                value={String(form.target_protein)}
                unit="g"
                keyboard="numeric"
                onChange={(v) => updateField("target_protein", v)}
              />
              <IconInput
                fieldKey="target_carbs"
                label="Carbs Goal"
                value={String(form.target_carbs)}
                unit="g"
                keyboard="numeric"
                onChange={(v) => updateField("target_carbs", v)}
              />
              <IconInput
                fieldKey="target_fats"
                label="Fats Goal"
                value={String(form.target_fats)}
                unit="g"
                keyboard="numeric"
                onChange={(v) => updateField("target_fats", v)}
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
