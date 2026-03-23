import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useMemo } from "react";
import { NUTRIENTS } from "@/constants/nutrients";
import { NUTRIENT_META, FALLBACK_META } from "@/constants/nutrientMeta";
import { MacroData } from "@/types/macros";

interface Props {
  dayData: MacroData;
}

export default function MicronutrientGrid({ dayData }: Props) {
  const getNutrient = (key: string): number => {
    const val = (dayData as Record<string, unknown>)[key];
    return typeof val === "number" ? val : Number(val) || 0;
  };

  const filtered = useMemo(
    () =>
      NUTRIENTS.filter(
        (n) => !["protein", "carbs", "fat"].includes(n.key.toLowerCase()),
      ),
    [],
  );

  return (
    <>
      <Text
        className="text-xs font-bold text-slate-500 mb-3"
        style={{ letterSpacing: 1.5 }}
      >
        MICRONUTRIENTS
      </Text>

      <View className="flex-row flex-wrap gap-1">
        {filtered.map((n) => {
          const meta = NUTRIENT_META[n.key] ?? FALLBACK_META;
          const value = Math.round(getNutrient(n.key));

          return (
            <View
              key={n.key}
              className="rounded-[16px] bg-slate-900 p-3"
              style={{
                borderWidth: 0.5,
                borderColor: meta.border,
                width: "48%",
              }}
            >
              {/* Icon + label */}
              <View className="flex-row items-center gap-2 mb-2">
                <View
                  className="w-6 h-6 rounded-[8px] items-center justify-center"
                  style={{ backgroundColor: meta.bg }}
                >
                  <Feather
                    name={meta.icon as any}
                    size={12}
                    color={meta.color}
                  />
                </View>
                <Text
                  className="text-[9px] font-bold text-slate-500 uppercase"
                  style={{ letterSpacing: 1 }}
                  numberOfLines={1}
                >
                  {n.label}
                </Text>
              </View>

              {/* Value */}
              <View className="flex-row items-baseline gap-1">
                <Text
                  className="text-xl font-black text-white"
                  style={{ letterSpacing: -0.5 }}
                >
                  {value}
                </Text>
                <Text className="text-[10px] font-semibold text-slate-600">
                  {n.unit}
                </Text>
              </View>

              {/* Progress bar */}
              <View className="h-0.5 bg-slate-800 rounded-full overflow-hidden mt-2">
                <View
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: meta.color,
                    width: `${Math.min((value / 100) * 100, 100)}%`,
                  }}
                />
              </View>
            </View>
          );
        })}
      </View>
    </>
  );
}
