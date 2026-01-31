import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MotiText } from "moti";

export function Header() {
  return (
    <View className="px-6 pt-4 pb-2 flex-row justify-between items-end">
      <View>
        <MotiText
          from={{ opacity: 0, transform: [{ translateX: -10 }] }}
          animate={{ opacity: 1, transform: [{ translateX: 0 }] }}
        >
          Today
        </MotiText>
        <Text className="text-slate-950 text-4xl font-black tracking-tighter">
          My Day
        </Text>
      </View>

      <Pressable className="h-12 w-12 bg-slate-950 rounded-2xl items-center justify-center">
        <Feather name="plus" size={22} color="white" />
      </Pressable>
    </View>
  );
}
