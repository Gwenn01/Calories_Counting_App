import { Pressable, View, Text } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Food } from "@/types/foods";

type Props = {
  item: Food;
  onPress: (item: Food) => void;
};

const MacroBadge = ({
  icon,
  value,
  unit,
  color,
  bg,
}: {
  icon: string;
  value: number;
  unit: string;
  color: string;
  bg: string;
}) => (
  <View
    style={{ backgroundColor: bg }}
    className="flex-row items-center gap-1 px-2 py-1 rounded-full"
  >
    <MaterialCommunityIcons name={icon as any} size={11} color={color} />
    <Text style={{ color }} className="text-[11px] font-semibold">
      {value}
      {unit}
    </Text>
  </View>
);

export const FoodItem = ({ item, onPress }: Props) => (
  <Pressable
    onPress={() => onPress(item)}
    android_ripple={{ color: "#f1f5f9" }}
    style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1 })}
    className="mb-3"
  >
    <View
      className="bg-white rounded-2xl overflow-hidden"
      style={{
        shadowColor: "#94a3b8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      {/* Color accent bar */}
      <View className="h-1 w-full bg-emerald-400" />

      <View className="p-4">
        {/* Top row: name + calories */}
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1 pr-4">
            {/* Food icon + name */}
            <View className="flex-row items-center gap-2 mb-1">
              <View className="w-8 h-8 bg-emerald-50 rounded-xl items-center justify-center">
                <MaterialCommunityIcons
                  name="food-apple-outline"
                  size={18}
                  color="#10b981"
                />
              </View>
              <Text
                className="text-base font-bold text-slate-900 flex-shrink"
                numberOfLines={1}
              >
                {item.name}
              </Text>
            </View>

            {/* Serving */}
            <View className="flex-row items-center gap-1 ml-10">
              <Ionicons name="restaurant-outline" size={11} color="#94a3b8" />
              <Text className="text-xs text-slate-400">{item.serving}</Text>
            </View>
          </View>

          {/* Calories block */}
          <View className="items-end">
            <View className="bg-slate-900 rounded-xl px-3 py-1.5 items-center">
              <Text className="text-white text-base font-extrabold leading-tight">
                {item.calories}
              </Text>
              <Text className="text-slate-400 text-[10px] font-medium tracking-wide uppercase">
                kcal
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom row: macro pills + chevron */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row gap-1.5">
            <MacroBadge
              icon="arm-flex-outline"
              value={item.protein}
              unit="g"
              color="#3b82f6"
              bg="#eff6ff"
            />
            <MacroBadge
              icon="grain"
              value={item.total_carbs}
              unit="g"
              color="#f59e0b"
              bg="#fffbeb"
            />
            <MacroBadge
              icon="water-outline"
              value={item.total_fat}
              unit="g"
              color="#ec4899"
              bg="#fdf2f8"
            />
          </View>

          <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
        </View>
      </View>
    </View>
  </Pressable>
);
