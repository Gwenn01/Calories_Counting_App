import { Pressable, View, Text } from "react-native";

interface Props {
  item: any;
  onPress?: (id: number) => void;
  onLongPress?: (id: number) => void;
}

export default function FoodRow({ item, onPress, onLongPress }: Props) {
  return (
    <Pressable
      onPress={() => onPress?.(item.food_details.id)}
      onLongPress={() => onLongPress?.(item.id)}
    >
      <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-slate-100">
        <View className="flex-1 pr-4">
          {/* Title */}
          <Text className="text-base font-bold text-slate-800 tracking-tight">
            {item.food_details.name}
          </Text>

          {/* Serving */}
          <Text className="text-sm font-medium text-slate-500 mt-0.5">
            {item.food_details.serving}
          </Text>

          {/* Macros */}
          <View className="flex-row items-center mt-2.5 space-x-2">
            <View className="bg-blue-50 px-2 py-1 rounded-md">
              <Text className="text-xs font-semibold text-blue-600">
                P {item.food_details.protein}g
              </Text>
            </View>

            <View className="bg-amber-50 px-2 py-1 rounded-md">
              <Text className="text-xs font-semibold text-amber-600">
                C {item.food_details.total_carbs}g
              </Text>
            </View>

            <View className="bg-rose-50 px-2 py-1 rounded-md">
              <Text className="text-xs font-semibold text-rose-600">
                F {item.food_details.total_fat}g
              </Text>
            </View>
          </View>
        </View>

        {/* Calories */}
        <View className="items-end">
          <Text className="text-lg font-extrabold text-slate-900">
            {item.food_details.calories}
          </Text>

          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
            kcal
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
