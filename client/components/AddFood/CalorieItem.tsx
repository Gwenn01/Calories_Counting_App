import { View, Text } from "react-native";

interface Props {
  label: string;
  value: number;
}

export default function CalorieItem({ label, value }: Props) {
  return (
    <View className="items-center min-w-[60px]">
      <Text className="text-lg font-extrabold text-slate-900">{value}</Text>

      <Text className="text-[11px] text-slate-400 mt-0.5">{label}</Text>
    </View>
  );
}
