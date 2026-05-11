import React from "react";
import { View, Text } from "react-native";

export function Section({
  label,
  children,
  action,
  accent = "#f97316",
}: {
  label: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  accent?: string;
}) {
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
        className="flex-row items-center justify-between px-4 py-3"
        style={{
          backgroundColor: "#f8fafc",
          borderBottomWidth: 1,
          borderBottomColor: "#f1f5f9",
        }}
      >
        <View className="flex-row items-center gap-x-2">
          {/* Accent dot */}
          <View
            className="w-1.5 h-4 rounded-full"
            style={{ backgroundColor: accent }}
          />
          <Text
            className="text-[10px] font-black uppercase tracking-widest"
            style={{ color: "#94a3b8" }}
          >
            {label}
          </Text>
        </View>

        {/* Action slot */}
        {action && <View>{action}</View>}
      </View>

      {/* Content */}
      <View className="p-4">{children}</View>
    </View>
  );
}
