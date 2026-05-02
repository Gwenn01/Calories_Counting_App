import { memo } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { SetRow } from "@/types/workout";

interface SetRowItemProps {
  set: SetRow;
  index: number;
  onWeightChange: (val: string) => void;
  onRepsChange: (val: string) => void;
  onComplete: () => void;
}

const SetRowItem = memo(function SetRowItem({
  set,
  index,
  onWeightChange,
  onRepsChange,
  onComplete,
}: SetRowItemProps) {
  return (
    <View
      className={`flex-row items-center px-4 py-2.5 gap-x-2 ${
        set.done ? "bg-green-50/60" : "bg-white"
      }`}
    >
      {/* Set number */}
      <View className="w-7 h-7 rounded-lg bg-slate-100 items-center justify-center">
        <Text className="text-xs font-bold text-slate-500">{index + 1}</Text>
      </View>

      {/* Weight */}
      <View className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
        <Text className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
          Weight
        </Text>
        <TextInput
          value={set.weight}
          onChangeText={onWeightChange}
          placeholder="0"
          keyboardType="decimal-pad"
          placeholderTextColor="#94a3b8"
          editable={!set.done}
          className="text-sm font-bold text-slate-800 p-0"
        />
      </View>

      {/* Reps */}
      <View className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
        <Text className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
          Reps
        </Text>
        <TextInput
          value={set.reps}
          onChangeText={onRepsChange}
          placeholder="0"
          keyboardType="number-pad"
          placeholderTextColor="#94a3b8"
          editable={!set.done}
          className="text-sm font-bold text-slate-800 p-0"
        />
      </View>

      {/* Complete button */}
      <Pressable
        onPress={onComplete}
        className={`w-9 h-9 rounded-xl items-center justify-center border ${
          set.done
            ? "bg-green-500 border-green-500"
            : "bg-white border-slate-200"
        }`}
      >
        <Ionicons
          name={set.done ? "checkmark" : "checkmark-outline"}
          size={17}
          color={set.done ? "#fff" : "#94a3b8"}
        />
      </Pressable>
    </View>
  );
});

export default SetRowItem;
