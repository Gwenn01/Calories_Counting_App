import React from "react";
import { View } from "react-native";
import { Section } from "@/components/Workout/TempplateModal/Section";
import { IconInput } from "@/components/Workout/TempplateModal/IconInput";

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
    <Section label="Template Info">
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
    </Section>
  );
}
