import React from "react";
import { View, Text } from "react-native";

interface MacroItemProps {
  label: string;
  value: string | number;
  color?: string;
}

export default function MacroItem({ label, value, color }: MacroItemProps) {
  return (
    <View className="items-center">
      <Text className={`text-lg font-extrabold ${color ?? "text-slate-900"}`}>
        {value}
      </Text>

      <Text className="text-xs text-slate-400 mt-1">{label}</Text>
    </View>
  );
}
