import { View, Text, Pressable } from "react-native";

interface RatingSliderProps {
  label: string;
  icon: string;
  value: number;
  onChange: (v: number) => void;
  activeColor: string;
}

export default function RatingSlider({
  label,
  icon,
  value,
  onChange,
  activeColor,
}: RatingSliderProps) {
  const levels = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <View>
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-1.5">
          <Text>{icon}</Text>
          <Text className="text-xs font-bold text-slate-600 uppercase tracking-widest">
            {label}
          </Text>
        </View>
        <Text className="text-sm font-black text-slate-800">{value}/10</Text>
      </View>
      <View className="flex-row gap-1">
        {levels.map((n) => (
          <Pressable key={n} onPress={() => onChange(n)} className="flex-1">
            <View
              className="h-2 rounded-full"
              style={{ backgroundColor: n <= value ? activeColor : "#e2e8f0" }}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
