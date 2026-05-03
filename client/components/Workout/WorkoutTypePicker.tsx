import { memo } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { WorkoutType } from "@/types/workout";
import { WORKOUT_TYPES } from "@/constants/workout";

interface WorkoutTypePickerProps {
  visible: boolean;
  current: WorkoutType;
  onClose: () => void;
  onSelect: (type: WorkoutType) => void;
}

const WorkoutTypePicker = memo(function WorkoutTypePicker({
  visible,
  current,
  onClose,
  onSelect,
}: WorkoutTypePickerProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      {/* Dim overlay — tapping outside closes */}
      <Pressable
        className="flex-1 bg-black/30 items-center justify-center px-8"
        onPress={onClose}
      >
        {/* Inner Pressable stops tap from bubbling to overlay */}
        <Pressable onPress={() => {}}>
          <View className="bg-white w-full rounded-[28px] shadow-xl overflow-hidden">
            {/* Header */}
            <View className="px-5 pt-5 pb-3">
              <Text className="text-base font-black text-slate-800">
                Workout Type
              </Text>
            </View>

            {/* Options */}
            {WORKOUT_TYPES.map((type, index) => {
              const isActive = type === current;
              const isLast = index === WORKOUT_TYPES.length - 1;

              return (
                <Pressable
                  key={type}
                  onPress={() => {
                    onSelect(type);
                    onClose();
                  }}
                  className={`flex-row items-center justify-between px-5 py-3.5 active:bg-slate-50 ${
                    !isLast ? "border-b border-slate-100" : ""
                  } ${isActive ? "bg-orange-50" : ""}`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      isActive ? "text-orange-500" : "text-slate-700"
                    }`}
                  >
                    {type}
                  </Text>

                  {isActive && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color="#f97316"
                    />
                  )}
                </Pressable>
              );
            })}

            <View className="h-2" />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
});

export default WorkoutTypePicker;
