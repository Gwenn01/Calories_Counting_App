import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import FloatingInput from "@/components/floatingInput";
import { useState } from "react";

type TargetInputProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon: keyof typeof Feather.glyphMap;
  color: string;
};

export default function TargetInput({
  label,
  value,
  onChange,
  icon,
  color,
}: TargetInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className="flex-row items-center mb-4 rounded-3xl transition-all"
      style={{
        // Height ensures enough room for the label to float up without being cut off
        height: 72,
        paddingHorizontal: 12,
        // Dynamic Border
        borderWidth: 1.5,
        borderColor: isFocused ? color : `${color}30`,
        // Dynamic Background
        backgroundColor: isFocused ? `${color}08` : `${color}05`,
      }}
    >
      {/* 1. THE ICON BUBBLE (Rendered separately to avoid label clash) */}
      <View
        className="items-center justify-center rounded-2xl mr-1"
        style={{
          width: 44,
          height: 44,
          backgroundColor: `${color}15`, // Subtle tint
        }}
      >
        <Feather name={icon} size={20} color={color} />
      </View>

      {/* 2. THE INPUT AREA */}
      <View className="flex-1 -mt-1">
        {/* Negative margin top helps align the text vertically with the icon */}
        <FloatingInput
          label={label}
          value={value}
          onChange={onChange}
          isNumeric
          // Focus Management
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          // STYLE OVERRIDES:
          // 1. Remove internal borders/bg because the wrapper handles it
          containerStyle={{
            backgroundColor: "transparent",
            borderWidth: 0,
            marginBottom: 0, // Remove default margins
            height: "100%",
            justifyContent: "center",
          }}
          // 2. Style the text input
          style={{
            color: "#1e293b", // Slate-800
            fontWeight: "600",
            fontSize: 16,
            height: 50, // Ensure hit slop is large enough
          }}
        />
      </View>
    </View>
  );
}
