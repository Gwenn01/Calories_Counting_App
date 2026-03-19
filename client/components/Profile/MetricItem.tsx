import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

const METRIC_META: Record<
  string,
  { icon: string; color: string; bg: string; border: string; label: string }
> = {
  age: {
    icon: "user",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#ede9fe",
    label: "Age",
  },
  weight: {
    icon: "trending-up",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fef3c7",
    label: "Weight",
  },
  height: {
    icon: "bar-chart-2",
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#dbeafe",
    label: "Height",
  },
  gender: {
    icon: "heart",
    color: "#ec4899",
    bg: "#fdf2f8",
    border: "#fce7f3",
    label: "Gender",
  },
  activity_level: {
    icon: "zap",
    color: "#f97316",
    bg: "#fff7ed",
    border: "#ffedd5",
    label: "Activity",
  },
  goal: {
    icon: "target",
    color: "#10b981",
    bg: "#f0fdf4",
    border: "#dcfce7",
    label: "Goal",
  },
};

// MetricItem component
function MetricItem({
  metricKey,
  value,
}: {
  metricKey: string;
  value: string;
}) {
  const meta = METRIC_META[metricKey];

  return (
    <View
      className="rounded-[18px] p-3 flex-1 mx-1"
      style={{
        backgroundColor: meta.bg,
        borderWidth: 1,
        borderColor: meta.border,
      }}
    >
      {/* Icon */}
      <View
        className="w-7 h-7 rounded-[10px] items-center justify-center mb-2"
        style={{
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: meta.border,
        }}
      >
        <Feather name={meta.icon as any} size={13} color={meta.color} />
      </View>

      {/* Value */}
      <Text
        className="font-black text-slate-800 mb-0.5"
        style={{ fontSize: 13, letterSpacing: -0.3 }}
        numberOfLines={1}
      >
        {value}
      </Text>

      {/* Label */}
      <Text
        className="font-bold text-slate-400 uppercase"
        style={{ fontSize: 8, letterSpacing: 1 }}
      >
        {meta.label}
      </Text>
    </View>
  );
}

export default MetricItem;
