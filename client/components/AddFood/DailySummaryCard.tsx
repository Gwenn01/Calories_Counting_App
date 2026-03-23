import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MotiView } from "moti";

interface Props {
  goalCalories: number;
  foodCalories: number;
  remainingCalories: number;
  direction?: "left" | "right";
}

export default function DailySummaryCard({
  goalCalories,
  foodCalories,
  remainingCalories,
  direction = "right",
}: Props) {
  const progressPercent = Math.min((foodCalories / goalCalories) * 100, 100);

  return (
    // Single top-level fade — no translateX or scale
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "timing", duration: 300 }}
      className="rounded-[28px] p-5 mb-4"
      style={{
        backgroundColor: "#0f172a",
        borderWidth: 1,
        borderColor: "#1e293b",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 24,
        elevation: 12,
      }}
    >
      <SummaryHeader />
      <SummaryStats
        goalCalories={goalCalories}
        foodCalories={foodCalories}
        remainingCalories={remainingCalories}
      />
      <SummaryProgress progressPercent={progressPercent} />
    </MotiView>
  );
}

/* ------- Sub-components ------- */

function SummaryHeader() {
  return (
    <View className="flex-row items-center mb-4 gap-2">
      <View
        className="p-1.5 rounded-xl"
        style={{
          backgroundColor: "#052e16",
          borderWidth: 1,
          borderColor: "#14532d",
        }}
      >
        <Feather name="pie-chart" size={13} color="#4ade80" />
      </View>
      <Text
        className="text-[10px] font-black text-slate-500"
        style={{ letterSpacing: 2 }}
      >
        DAILY SUMMARY
      </Text>
    </View>
  );
}

function StatColumn({
  label,
  value,
  highlighted = false,
}: {
  label: string;
  value: number;
  highlighted?: boolean;
}) {
  return (
    <View
      className="flex-1 items-center justify-center py-4 px-3 rounded-[20px]"
      style={
        highlighted
          ? {
              backgroundColor: "#052e16",
              borderWidth: 1,
              borderColor: "#14532d",
              margin: 4,
            }
          : undefined
      }
    >
      <Text
        className={`text-[9px] font-black mb-1.5 uppercase ${highlighted ? "text-emerald-700" : "text-slate-600"}`}
        style={{ letterSpacing: 1.5 }}
      >
        {label}
      </Text>

      <Text
        className={`font-black ${highlighted ? "text-emerald-400" : "text-slate-200"}`}
        style={{ fontSize: 22, letterSpacing: -0.5 }}
      >
        {value}
      </Text>

      <Text
        className={`text-[9px] font-semibold mt-0.5 ${highlighted ? "text-emerald-800" : "text-slate-600"}`}
      >
        kcal
      </Text>
    </View>
  );
}

function VerticalDivider() {
  return (
    <View className="w-[1px] my-3" style={{ backgroundColor: "#1e293b" }} />
  );
}

function SummaryStats({
  goalCalories,
  foodCalories,
  remainingCalories,
}: {
  goalCalories: number;
  foodCalories: number;
  remainingCalories: number;
}) {
  return (
    <View
      className="flex-row items-stretch rounded-[20px] overflow-hidden"
      style={{
        backgroundColor: "#0d1f2d",
        borderWidth: 1,
        borderColor: "#1e293b",
      }}
    >
      <StatColumn label="Goal" value={goalCalories} />
      <VerticalDivider />
      <StatColumn label="Food" value={foodCalories} />
      <VerticalDivider />
      <StatColumn label="Left" value={remainingCalories} highlighted />
    </View>
  );
}

function SummaryProgress({ progressPercent }: { progressPercent: number }) {
  return (
    <View className="mt-4 px-1">
      <View className="flex-row justify-between mb-1.5">
        <Text
          className="text-[9px] text-slate-600 font-bold uppercase"
          style={{ letterSpacing: 1 }}
        >
          Progress
        </Text>
        <Text className="text-[9px] text-slate-500 font-bold">
          {Math.round(progressPercent)}%
        </Text>
      </View>

      <View
        className="h-1 rounded-full overflow-hidden"
        style={{ backgroundColor: "#1e293b" }}
      >
        {/* Keep only the progress bar animation — most impactful visual */}
        <MotiView
          from={{ width: "0%" as `${number}%` }}
          animate={{ width: `${progressPercent}%` as `${number}%` }}
          transition={{ type: "timing", duration: 600 }}
          className="h-full rounded-full"
          style={{ backgroundColor: "#4ade80" }}
        />
      </View>
    </View>
  );
}
