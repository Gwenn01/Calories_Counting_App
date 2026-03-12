import React from "react";
import { View, Text } from "react-native";

interface MetricItemProps {
  label: string;
  value: string | number;
}

export default function MetricItem({ label, value }: MetricItemProps) {
  return (
    <View className="items-center">
      <Text className="text-lg font-extrabold text-slate-900">{value}</Text>

      <Text className="text-xs text-slate-400 mt-1">{label}</Text>
    </View>
  );
}
