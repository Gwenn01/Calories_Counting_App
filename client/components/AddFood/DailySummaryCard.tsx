import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MotiView } from "moti";

interface Props {
  goalCalories: number;
  foodCalories: number;
  remainingCalories: number;
  direction?: "left" | "right"; // new
}

export default function DailySummaryCard({
  goalCalories,
  foodCalories,
  remainingCalories,
  direction = "right",
}: Props) {
  const progressPercent = Math.min((foodCalories / goalCalories) * 100, 100);
  const slideFrom = direction === "right" ? 40 : -40; // slides from nav direction

  return (
    <MotiView
      from={{ opacity: 0, translateX: slideFrom, scale: 0.97 }}
      animate={{ opacity: 1, translateX: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
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
      <SummaryHeader slideFrom={slideFrom} />
      <SummaryStats
        goalCalories={goalCalories}
        foodCalories={foodCalories}
        remainingCalories={remainingCalories}
        slideFrom={slideFrom}
      />
      <SummaryProgress progressPercent={progressPercent} />
    </MotiView>
  );
}

/* ------- Sub-components ------- */

function SummaryHeader({ slideFrom }: { slideFrom: number }) {
  return (
    <MotiView
      from={{ opacity: 0, translateX: slideFrom }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: "timing", duration: 350, delay: 100 }}
      className="flex-row items-center mb-4 gap-2"
    >
      <MotiView
        from={{
          opacity: 0,
          scale: 0.4,
          rotate: slideFrom > 0 ? "-30deg" : "30deg",
        }}
        animate={{ opacity: 1, scale: 1, rotate: "0deg" }}
        transition={{ type: "spring", stiffness: 220, damping: 14, delay: 150 }}
        className="p-1.5 rounded-xl"
        style={{
          backgroundColor: "#052e16",
          borderWidth: 1,
          borderColor: "#14532d",
        }}
      >
        <Feather name="pie-chart" size={13} color="#4ade80" />
      </MotiView>
      <Text
        className="text-[10px] font-black text-slate-500"
        style={{ letterSpacing: 2 }}
      >
        DAILY SUMMARY
      </Text>
    </MotiView>
  );
}

function StatColumn({
  label,
  value,
  highlighted = false,
  delay = 0,
  slideFrom = 0,
}: {
  label: string;
  value: number;
  highlighted?: boolean;
  delay?: number;
  slideFrom?: number;
}) {
  return (
    <MotiView
      from={{ opacity: 0, translateX: slideFrom * 0.5, translateY: 10 }}
      animate={{ opacity: 1, translateX: 0, translateY: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 16, delay }}
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

      <MotiView
        from={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 240,
          damping: 14,
          delay: delay + 80,
        }}
      >
        <Text
          className={`font-black ${highlighted ? "text-emerald-400" : "text-slate-200"}`}
          style={{ fontSize: 22, letterSpacing: -0.5 }}
        >
          {value}
        </Text>
      </MotiView>

      <Text
        className={`text-[9px] font-semibold mt-0.5 ${highlighted ? "text-emerald-800" : "text-slate-600"}`}
      >
        kcal
      </Text>
    </MotiView>
  );
}

function VerticalDivider() {
  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "timing", duration: 300, delay: 250 }}
      className="w-[1px] my-3"
      style={{ backgroundColor: "#1e293b" }}
    />
  );
}

function SummaryStats({
  goalCalories,
  foodCalories,
  remainingCalories,
  slideFrom,
}: {
  goalCalories: number;
  foodCalories: number;
  remainingCalories: number;
  slideFrom: number;
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
      {/* Columns stagger in from nav direction */}
      <StatColumn
        label="Goal"
        value={goalCalories}
        delay={200}
        slideFrom={slideFrom}
      />
      <VerticalDivider />
      <StatColumn
        label="Food"
        value={foodCalories}
        delay={280}
        slideFrom={slideFrom}
      />
      <VerticalDivider />
      <StatColumn
        label="Left"
        value={remainingCalories}
        delay={360}
        slideFrom={slideFrom}
        highlighted
      />
    </View>
  );
}

function SummaryProgress({ progressPercent }: { progressPercent: number }) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 6 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 350, delay: 400 }}
      className="mt-4 px-1"
    >
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
        <MotiView
          from={{ width: "0%" as `${number}%` }}
          animate={{ width: `${progressPercent}%` as `${number}%` }}
          transition={{ type: "timing", duration: 800, delay: 480 }}
          className="h-full rounded-full"
          style={{
            backgroundColor: "#4ade80",
            shadowColor: "#4ade80",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 4,
          }}
        />
      </View>
    </MotiView>
  );
}
