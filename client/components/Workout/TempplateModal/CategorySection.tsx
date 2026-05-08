import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CATEGORIES: {
  key: string;
  label: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  activeBg: string;
  activeBorder: string;
}[] = [
  {
    key: "push",
    label: "Push",
    icon: "arrow-up-circle-outline",
    color: "#f97316",
    bg: "#fff7ed",
    border: "#ffedd5",
    activeBg: "#fff7ed",
    activeBorder: "#f97316",
  },
  {
    key: "pull",
    label: "Pull",
    icon: "arrow-down-circle-outline",
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#dbeafe",
    activeBg: "#eff6ff",
    activeBorder: "#3b82f6",
  },
  {
    key: "legs",
    label: "Legs",
    icon: "body-outline",
    color: "#10b981",
    bg: "#f0fdf4",
    border: "#dcfce7",
    activeBg: "#f0fdf4",
    activeBorder: "#10b981",
  },
  {
    key: "upper",
    label: "Upper",
    icon: "fitness-outline",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#ede9fe",
    activeBg: "#f5f3ff",
    activeBorder: "#8b5cf6",
  },
  {
    key: "lower",
    label: "Lower",
    icon: "walk-outline",
    color: "#ec4899",
    bg: "#fdf2f8",
    border: "#fce7f3",
    activeBg: "#fdf2f8",
    activeBorder: "#ec4899",
  },
  {
    key: "full_body",
    label: "Full Body",
    icon: "flash-outline",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fef3c7",
    activeBg: "#fffbeb",
    activeBorder: "#f59e0b",
  },
  {
    key: "cardio",
    label: "Cardio",
    icon: "heart-outline",
    color: "#ef4444",
    bg: "#fef2f2",
    border: "#fecaca",
    activeBg: "#fef2f2",
    activeBorder: "#ef4444",
  },
];

type Props = {
  category: string;
  onCategoryChange: (cat: string) => void;
};

export default function CategorySection({ category, onCategoryChange }: Props) {
  return (
    <View
      className="rounded-[24px] mb-4 overflow-hidden"
      style={{
        borderWidth: 1,
        borderColor: "#f1f5f9",
        backgroundColor: "#ffffff",
        shadowColor: "#94a3b8",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {/* Header band */}
      <View
        className="flex-row items-center px-4 py-3"
        style={{
          backgroundColor: "#f8fafc",
          borderBottomWidth: 1,
          borderBottomColor: "#f1f5f9",
        }}
      >
        <View
          className="w-7 h-7 rounded-[10px] items-center justify-center mr-2.5"
          style={{ backgroundColor: "#0f172a" }}
        >
          <Ionicons name="grid-outline" size={13} color="#fff" />
        </View>
        <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Category
        </Text>
      </View>

      {/* Grid */}
      <View className="p-4">
        <View className="flex-row flex-wrap" style={{ gap: 8 }}>
          {CATEGORIES.map((cat) => {
            const isActive = category === cat.key;
            return (
              <Pressable
                key={cat.key}
                onPress={() => onCategoryChange(cat.key)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.8 : 1,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 14,
                  borderWidth: isActive ? 1.5 : 1,
                  backgroundColor: isActive ? cat.activeBg : "#f8fafc",
                  borderColor: isActive ? cat.activeBorder : "#e2e8f0",
                })}
              >
                {/* Icon chip */}
                <View
                  className="w-6 h-6 rounded-lg items-center justify-center"
                  style={{
                    backgroundColor: isActive ? cat.bg : "#ffffff",
                    borderWidth: 1,
                    borderColor: isActive ? cat.border : "#e2e8f0",
                  }}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={12}
                    color={isActive ? cat.color : "#94a3b8"}
                  />
                </View>
                <Text
                  className="text-xs font-bold capitalize"
                  style={{ color: isActive ? cat.color : "#94a3b8" }}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
