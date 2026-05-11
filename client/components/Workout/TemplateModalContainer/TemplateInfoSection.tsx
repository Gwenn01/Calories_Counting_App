import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { IconInput } from "@/components/Workout/TemplateModalContainer/IconInput";

type Props = {
  name: string;
  description: string;
  duration: string;
  onNameChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onDurationChange: (v: string) => void;
};

export default function TemplateInfoSection({
  name,
  description,
  duration,
  onNameChange,
  onDescriptionChange,
  onDurationChange,
}: Props) {
  return (
    <View
      className="rounded-[24px] mb-4 overflow-hidden"
      style={{
        borderWidth: 1,
        borderColor: "#f1f5f9",
        backgroundColor: "#ffffff",
        shadowColor: "#94a3b8",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {/* Header band */}
      <View
        className="flex-row items-center px-4 py-3"
        style={{
          backgroundColor: "#fff7ed",
          borderBottomWidth: 1,
          borderBottomColor: "#ffedd5",
        }}
      >
        <View
          className="w-7 h-7 rounded-[10px] items-center justify-center mr-2.5"
          style={{ backgroundColor: "#f97316" }}
        >
          <Feather name="file-text" size={13} color="#fff" />
        </View>
        <Text className="text-xs font-bold text-orange-500 uppercase tracking-widest">
          Template Info
        </Text>
      </View>

      {/* Fields */}
      <View className="px-4 pt-4 pb-2">
        <IconInput
          fieldKey="name"
          label="Template Name"
          value={name}
          onChange={onNameChange}
          placeholder="e.g. Push Day A"
        />
        <IconInput
          fieldKey="description"
          label="Description"
          value={description}
          onChange={onDescriptionChange}
          placeholder="Optional notes"
        />
        <IconInput
          fieldKey="duration"
          label="Est. Duration"
          value={duration}
          onChange={onDurationChange}
          keyboard="numeric"
          unit="min"
        />
      </View>
    </View>
  );
}
