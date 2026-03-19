import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

interface MealCardProps {
  title: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  onAdd: () => void;
}

const MEAL_META: Record<
  string,
  { icon: string; color: string; bg: string; border: string }
> = {
  Breakfast: {
    icon: "sun",
    color: "#fb923c",
    bg: "#431407",
    border: "#7c2d12",
  },
  Lunch: { icon: "cloud", color: "#38bdf8", bg: "#0c1a2e", border: "#0c4a6e" },
  Dinner: { icon: "moon", color: "#a78bfa", bg: "#1e0a3c", border: "#4c1d95" },
  Snacks: {
    icon: "coffee",
    color: "#4ade80",
    bg: "#052e16",
    border: "#14532d",
  },
};

const FALLBACK_MEAL = {
  icon: "activity",
  color: "#94a3b8",
  bg: "#1e293b",
  border: "#334155",
};

const MACROS = [
  { key: "protein", label: "Protein", color: "#60a5fa" },
  { key: "carbs", label: "Carbs", color: "#fb923c" },
  { key: "fats", label: "Fats", color: "#f472b6" },
] as const;

export default function MealCard({
  title,
  calories,
  protein,
  carbs,
  fats,
  onAdd,
}: MealCardProps) {
  const meta = MEAL_META[title] ?? FALLBACK_MEAL;
  const macroValues = { protein, carbs, fats };
  const isEmpty = calories === 0;

  return (
    <View
      className="rounded-[24px] p-4 mb-3"
      style={{
        backgroundColor: "#0f172a",
        borderWidth: 1,
        borderColor: "#1e293b",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
      }}
    >
      {/* Top Row: Icon + Title + Add Button */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-3">
          {/* Meal Icon */}
          <View
            className="w-10 h-10 rounded-[14px] items-center justify-center"
            style={{
              backgroundColor: meta.bg,
              borderWidth: 1,
              borderColor: meta.border,
            }}
          >
            <Feather name={meta.icon as any} size={16} color={meta.color} />
          </View>

          {/* Title + Calories */}
          <View>
            <Text
              className="font-black text-slate-100"
              style={{ fontSize: 16, letterSpacing: -0.3 }}
            >
              {title}
            </Text>
            <Text
              className="font-semibold text-slate-500"
              style={{ fontSize: 11, letterSpacing: 0.3 }}
            >
              {isEmpty ? "Nothing logged yet" : `${calories} kcal`}
            </Text>
          </View>
        </View>

        {/* Add Button */}
        <Pressable
          onPress={onAdd}
          className="flex-row items-center gap-1.5 rounded-full px-4 py-2"
          style={({ pressed }) => ({
            backgroundColor: pressed ? meta.border : meta.bg,
            borderWidth: 1,
            borderColor: meta.border,
          })}
        >
          <Feather name="plus" size={13} color={meta.color} />
          <Text
            className="font-bold"
            style={{ fontSize: 12, color: meta.color }}
          >
            Add
          </Text>
        </Pressable>
      </View>

      {/* Divider */}
      <View className="h-[1px] mb-3" style={{ backgroundColor: "#1e293b" }} />

      {/* Macro Pills Row */}
      <View className="flex-row gap-2">
        {MACROS.map(({ key, label, color }) => {
          const val = Math.round(macroValues[key]);
          return (
            <View
              key={key}
              className="flex-1 rounded-[14px] p-2.5 items-center"
              style={{
                backgroundColor: "#0d1f2d",
                borderWidth: 1,
                borderColor: "#1e293b",
              }}
            >
              <Text
                className="font-black"
                style={{ fontSize: 15, color, letterSpacing: -0.3 }}
              >
                {val}
                <Text
                  style={{ fontSize: 9, color: "#475569", fontWeight: "600" }}
                >
                  g
                </Text>
              </Text>
              <Text
                className="font-bold text-slate-600 mt-0.5"
                style={{ fontSize: 9, letterSpacing: 1 }}
              >
                {label.toUpperCase()}
              </Text>

              {/* Micro bar */}
              <View
                className="h-0.5 rounded-full overflow-hidden mt-2 w-full"
                style={{ backgroundColor: "#1e293b" }}
              >
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min((val / 50) * 100, 100)}%`,
                    backgroundColor: color,
                    opacity: 0.7,
                  }}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
