import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { PieChart } from "react-native-gifted-charts";
import { MotiView } from "moti";

interface MacroItem {
  label: string;
  value: number;
  color: string;
}

interface Props {
  protein: number;
  carbs: number;
  fats: number;
  direction: "left" | "right"; //
}

export default function MacroChart({ protein, carbs, fats, direction }: Props) {
  const proteinCal = protein * 4;
  const carbsCal = carbs * 4;
  const fatsCal = fats * 9;
  const totalLogged = proteinCal + carbsCal + fatsCal || 1;
  const isEmpty = totalLogged === 1;

  const slideFrom = direction === "right" ? 40 : -40; //

  const macros: MacroItem[] = [
    { label: "Protein", value: protein, color: "#6366f1" },
    { label: "Carbs", value: carbs, color: "#0ea5e9" },
    { label: "Fats", value: fats, color: "#f43f5e" },
  ];

  const pieData = [
    { value: proteinCal, color: "#6366f1" },
    { value: carbsCal, color: "#0ea5e9" },
    { value: fatsCal, color: "#f43f5e" },
  ];

  const displayData = isEmpty ? [{ value: 100, color: "#e2e8f0" }] : pieData;

  return (
    //  Card slides in from direction of navigation
    <MotiView
      from={{ opacity: 0, translateX: slideFrom }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 20 }}
      className="bg-white rounded-[24px] px-5 py-4 mb-6 border border-slate-100"
    >
      <Text className="text-sm font-bold text-slate-800 mb-4">Macro Split</Text>

      <View className="flex-row items-center gap-4">
        {/* Donut scales in */}
        <MotiView
          from={{
            opacity: 0,
            scale: 0.6,
            rotate: direction === "right" ? "-30deg" : "30deg",
          }}
          animate={{ opacity: 1, scale: 1, rotate: "0deg" }}
          transition={{
            type: "spring",
            stiffness: 140,
            damping: 14,
            delay: 80,
          }}
          className="items-center justify-center"
        >
          <PieChart
            data={displayData}
            donut
            radius={46}
            innerRadius={34}
            showText={false}
          />
          <MotiView
            from={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              delay: 280,
              stiffness: 200,
              damping: 14,
            }}
            className="absolute items-center justify-center"
          >
            <Feather
              name="pie-chart"
              size={14}
              color={isEmpty ? "#cbd5e1" : "#64748b"}
            />
          </MotiView>
        </MotiView>

        {/* Legend rows stagger in from direction */}
        <View className="flex-1 gap-2">
          {macros.map((m, i) => {
            const calVal = pieData[i].value;
            const percentage = isEmpty
              ? 0
              : Math.round((calVal / totalLogged) * 100);

            return (
              <MotiView
                key={m.label}
                from={{ opacity: 0, translateX: slideFrom * 0.6 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{
                  type: "spring",
                  delay: 100 + i * 70,
                  stiffness: 180,
                  damping: 18,
                }}
                className="flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-2">
                  <MotiView
                    from={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      delay: 180 + i * 70,
                      stiffness: 260,
                      damping: 14,
                    }}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: m.color }}
                  />
                  <Text className="text-xs text-slate-500 font-semibold">
                    {m.label}
                  </Text>
                </View>

                <View className="flex-row items-center gap-2">
                  <Text className="text-xs text-slate-400">{m.value}g</Text>
                  <MotiView
                    from={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      type: "spring",
                      delay: 220 + i * 70,
                      stiffness: 220,
                      damping: 14,
                    }}
                    className="px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: m.color + "20" }}
                  >
                    <Text
                      className="text-[11px] font-bold"
                      style={{ color: m.color }}
                    >
                      {percentage}%
                    </Text>
                  </MotiView>
                </View>
              </MotiView>
            );
          })}
        </View>
      </View>
    </MotiView>
  );
}
