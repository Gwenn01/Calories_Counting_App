import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

interface RatingSliderProps {
  label: string;
  icon: keyof typeof Feather.glyphMap;
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
    <View className="bg-slate-50 border border-slate-100 rounded-[18px] px-4 py-4 mb-3">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <View
            className="w-7 h-7 rounded-[8px] items-center justify-center"
            style={{ backgroundColor: activeColor + "20" }}
          >
            <Feather name={icon} size={13} color={activeColor} />
          </View>
          <Text className="text-xs font-bold text-slate-600 uppercase tracking-widest">
            {label}
          </Text>
        </View>

        {/* Value badge */}
        <View
          className="px-2.5 py-0.5 rounded-full"
          style={{ backgroundColor: activeColor + "20" }}
        >
          <Text className="text-xs font-black" style={{ color: activeColor }}>
            {value}/10
          </Text>
        </View>
      </View>

      {/* Bar */}
      <View className="flex-row gap-1">
        {levels.map((n) => (
          <Pressable key={n} onPress={() => onChange(n)} className="flex-1">
            <View
              className="rounded-full"
              style={{
                height: n <= value ? 8 : 6,
                backgroundColor: n <= value ? activeColor : "#e2e8f0",
                opacity: n <= value ? 1 - (value - n) * 0.06 : 1,
                marginTop: n <= value ? 0 : 1,
              }}
            />
          </Pressable>
        ))}
      </View>

      {/* Min / Max labels */}
      <View className="flex-row justify-between mt-2">
        <Text className="text-[9px] text-slate-400 font-semibold">Low</Text>
        <Text className="text-[9px] text-slate-400 font-semibold">High</Text>
      </View>
    </View>
  );
}
