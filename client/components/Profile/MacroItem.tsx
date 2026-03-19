import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

interface MacroItemProps {
  label: string;
  value: string | number;
  unit?: string;
  metricKey?: string;
}

const MACRO_META: Record<
  string,
  { icon: string; color: string; bg: string; border: string }
> = {
  protein: { icon: "zap", color: "#3b82f6", bg: "#eff6ff", border: "#dbeafe" },
  carbs: { icon: "sun", color: "#f97316", bg: "#fff7ed", border: "#ffedd5" },
  fat: { icon: "droplet", color: "#ec4899", bg: "#fdf2f8", border: "#fce7f3" },
  fats: { icon: "droplet", color: "#ec4899", bg: "#fdf2f8", border: "#fce7f3" },
  calories: {
    icon: "activity",
    color: "#10b981",
    bg: "#f0fdf4",
    border: "#dcfce7",
  },
  fiber: {
    icon: "feather",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#ede9fe",
  },
  sugar: { icon: "coffee", color: "#f59e0b", bg: "#fffbeb", border: "#fef3c7" },
  sodium: {
    icon: "thermometer",
    color: "#ef4444",
    bg: "#fef2f2",
    border: "#fecaca",
  },
};

const FALLBACK_META = {
  icon: "bar-chart-2",
  color: "#64748b",
  bg: "#f8fafc",
  border: "#e2e8f0",
};

export default function MacroItem({
  label,
  value,
  unit,
  metricKey,
}: MacroItemProps) {
  const key = metricKey ?? label.toLowerCase();
  const meta = MACRO_META[key] ?? FALLBACK_META;

  return (
    <View
      className="items-center rounded-[18px] px-3 py-3 flex-1 mx-1"
      style={{
        backgroundColor: meta.bg,
        borderWidth: 1,
        borderColor: meta.border,
      }}
    >
      {/* Icon chip */}
      <View
        className="w-8 h-8 rounded-[11px] items-center justify-center mb-2"
        style={{
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: meta.border,
          shadowColor: meta.color,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Feather name={meta.icon as any} size={13} color={meta.color} />
      </View>

      {/* Value + unit */}
      <View className="flex-row items-baseline gap-0.5">
        <Text
          className="font-black"
          style={{ fontSize: 16, color: meta.color, letterSpacing: -0.4 }}
        >
          {value}
        </Text>
        {unit && (
          <Text
            className="font-semibold text-slate-400"
            style={{ fontSize: 9 }}
          >
            {unit}
          </Text>
        )}
      </View>

      {/* Label */}
      <Text
        className="font-bold text-slate-400 uppercase mt-0.5"
        style={{ fontSize: 8, letterSpacing: 1 }}
      >
        {label}
      </Text>
    </View>
  );
}
