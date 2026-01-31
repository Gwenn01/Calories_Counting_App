import { View, Text } from "react-native";
import { MacroKey } from "@/types/macros";
import { MACRO_LABELS } from "@/constants/macros";

type Props = {
  label: MacroKey;
  value: number;
  target: number;
};

export default function MacroCard({ label, value, target }: Props) {
  return (
    <View className="bg-gray-100 rounded-2xl p-5 w-[48%]">
      <Text className="text-gray-500 text-sm mb-1">{MACRO_LABELS[label]}</Text>

      <Text className="text-3xl font-bold">
        {value}
        <Text className="text-base font-normal text-gray-400">
          {" "}
          / {target}g
        </Text>
      </Text>
    </View>
  );
}
