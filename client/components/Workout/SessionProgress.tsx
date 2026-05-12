import { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";

interface Props {
  completedSets: number;
  totalSets: number;
}

export default function SessionProgress({ completedSets, totalSets }: Props) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pct = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
  const isComplete = completedSets === totalSets && totalSets > 0;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: pct,
      duration: 500,
      useNativeDriver: false, // width animation needs false
    }).start();
  }, [pct]);

  const animatedWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="bg-white border border-slate-100 rounded-[16px] px-4 py-3 mb-7 mx-4">
      {/* Top row */}
      <View className="flex-row items-center justify-between mb-2.5">
        <View className="flex-row items-center gap-1.5">
          <Text className="text-xs font-bold text-slate-700">
            {completedSets}
            <Text className="text-slate-400 font-medium"> / {totalSets}</Text>
          </Text>
          <Text className="text-xs text-slate-400">sets completed</Text>
        </View>

        {/* Percentage badge */}
        <View
          className="px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: isComplete
              ? "rgba(16,185,129,0.1)"
              : "rgba(148,163,184,0.1)",
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: isComplete ? "#10b981" : "#94a3b8",
            }}
          >
            {Math.round(pct)}%
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <Animated.View
          style={{
            height: "100%",
            width: animatedWidth,
            backgroundColor: isComplete ? "#10b981" : "#f97316",
            borderRadius: 999,
          }}
        />
      </View>

      {/* Segment ticks */}
      {totalSets > 1 && (
        <View
          className="flex-row absolute"
          style={{ left: 16, right: 16, bottom: 11, height: 8 }}
        >
          {Array.from({ length: totalSets - 1 }).map((_, i) => (
            <View
              key={i}
              style={{
                position: "absolute",
                left: `${((i + 1) / totalSets) * 100}%`,
                width: 2,
                height: 8,
                backgroundColor: "#f8fafc",
                borderRadius: 1,
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}
