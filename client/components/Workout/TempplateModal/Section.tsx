import React from "react";
import { View, Text } from "react-native";

export function Section({
  label,
  children,
  action,
}: {
  label: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <View
      className="rounded-[20px] p-4 mb-4"
      style={{
        borderWidth: 1,
        borderColor: "#f1f5f9",
        backgroundColor: "#f8fafc",
      }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">
          {label}
        </Text>
        {action}
      </View>
      {children}
    </View>
  );
}
