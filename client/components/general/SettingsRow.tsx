import { View, Text, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

type SettingsRowProps = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress?: () => void;
};

export function SettingsRow({ icon, label, onPress }: SettingsRowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.left}>
        <Feather name={icon} size={18} color="#64748b" />
        <Text style={styles.text}>{label}</Text>
      </View>

      <Feather name="chevron-right" size={18} color="#cbd5e1" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
});
