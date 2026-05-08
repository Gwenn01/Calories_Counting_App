import React from "react";
import { View, Text, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";

const META: Record<
  string,
  { icon: string; color: string; bg: string; border: string }
> = {
  name: { icon: "edit-2", color: "#f97316", bg: "#fff7ed", border: "#ffedd5" },
  description: {
    icon: "file-text",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#ede9fe",
  },
  duration: {
    icon: "clock",
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#dbeafe",
  },
  default_sets: {
    icon: "layers",
    color: "#10b981",
    bg: "#f0fdf4",
    border: "#dcfce7",
  },
  default_reps: {
    icon: "repeat",
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#dbeafe",
  },
  default_weight: {
    icon: "trending-up",
    color: "#ec4899",
    bg: "#fdf2f8",
    border: "#fce7f3",
  },
  default_rest: {
    icon: "clock",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fef3c7",
  },
  notes: {
    icon: "message-square",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#ede9fe",
  },
};

export function IconInput({
  fieldKey,
  label,
  value,
  onChange,
  keyboard = "default",
  unit,
  placeholder,
}: {
  fieldKey: string;
  label: string;
  value: string;
  unit?: string;
  placeholder?: string;
  onChange: (v: string) => void;
  keyboard?: string;
}) {
  const meta = META[fieldKey] ?? {
    icon: "edit",
    color: "#64748b",
    bg: "#f8fafc",
    border: "#e2e8f0",
  };

  return (
    <View className="flex-row items-center mb-3">
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
      <View className="flex-1">
        {label.length > 0 && (
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            {label}
          </Text>
        )}
        <View className="flex-row items-center border border-slate-200 rounded-xl px-3 py-2 bg-white">
          <TextInput
            value={value}
            onChangeText={onChange}
            keyboardType={keyboard as any}
            placeholder={placeholder}
            placeholderTextColor="#cbd5e1"
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
