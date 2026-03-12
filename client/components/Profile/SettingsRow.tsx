import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

type SettingsRowProps = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress?: () => void;
};

export function SettingsRow({ icon, label, onPress }: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between px-5 py-4 border-b border-slate-100 active:bg-slate-50"
    >
      <View className="flex-row items-center gap-3">
        <Feather name={icon} size={18} color="#64748b" />

        <Text className="text-base font-semibold text-slate-900">{label}</Text>
      </View>

      <Feather name="chevron-right" size={18} color="#cbd5e1" />
    </Pressable>
  );
}
