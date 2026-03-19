import { Pressable, View, Text } from "react-native";

interface Props {
  item: any;
  isLast?: boolean; // Added to hide bottom border on the final item
  onPress?: (id: number) => void;
  onLongPress?: (id: number) => void;
}

export default function FoodRow({ item, isLast, onPress, onLongPress }: Props) {
  return (
    <Pressable
      onPress={() => onPress?.(item.food_details.id)}
      onLongPress={() => onLongPress?.(item.id)}
    >
      <View
        className={`flex-row items-center justify-between px-5 py-4 ${
          !isLast ? "border-b border-slate-100/80" : ""
        }`}
      >
        <View className="flex-1 pr-4">
          {/* Title */}
          <Text className="text-base font-bold text-slate-800 tracking-tight">
            {item.food_details.name}
          </Text>

          {/* Serving */}
          <Text className="text-sm font-medium text-slate-400 mt-0.5">
            {item.food_details.serving}
          </Text>

          {/* Macros (Updated to match your Violet/Blue/Red theme) */}
          <View className="flex-row items-center mt-2.5 gap-2">
            <View className="bg-violet-50 px-2 py-1 rounded-md border border-violet-100/50">
              <Text className="text-[11px] font-bold text-violet-600">
                P {item.food_details.protein}g
              </Text>
            </View>

            <View className="bg-blue-50 px-2 py-1 rounded-md border border-blue-100/50">
              <Text className="text-[11px] font-bold text-blue-600">
                C {item.food_details.total_carbs}g
              </Text>
            </View>

            <View className="bg-red-50 px-2 py-1 rounded-md border border-red-100/50">
              <Text className="text-[11px] font-bold text-red-600">
                F {item.food_details.total_fat}g
              </Text>
            </View>
          </View>
        </View>

        {/* Calories */}
        <View className="items-end">
          <Text className="text-xl font-black text-slate-900">
            {item.food_details.calories}
          </Text>

          <Text
            className="text-[10px] font-bold text-slate-400 uppercase mt-0.5"
            style={{ letterSpacing: 1 }}
          >
            kcal
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
