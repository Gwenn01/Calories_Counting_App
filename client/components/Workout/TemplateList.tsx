// components/Workout/TemplateList.tsx
import React from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { WorkoutTemplate } from "@/types/workout";

type Props = {
  templates: WorkoutTemplate[];
  templatesLoading: boolean;
  onOpenCreate: () => void;
  onOpenEdit: (t: WorkoutTemplate) => void;
  onDelete: (t: WorkoutTemplate) => void;
};

export default function TemplateList({
  templates,
  templatesLoading,
  onOpenCreate,
  onOpenEdit,
  onDelete,
}: Props) {
  return (
    <View className="mt-3 bg-white rounded-[28px] border border-slate-100 shadow-sm p-5">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          My Templates
        </Text>
        <Pressable
          onPress={onOpenCreate}
          className="flex-row items-center gap-x-1 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-xl"
        >
          <Ionicons name="add" size={14} color="#f97316" />
          <Text className="text-xs font-bold text-orange-500">New</Text>
        </Pressable>
      </View>

      {/* Loading */}
      {templatesLoading && (
        <View className="py-8 items-center">
          <Text className="text-sm text-slate-400 font-medium">
            Loading templates...
          </Text>
        </View>
      )}

      {/* Empty */}
      {!templatesLoading && templates.length === 0 && (
        <Pressable
          onPress={onOpenCreate}
          className="py-8 items-center rounded-2xl"
          style={{
            borderWidth: 2,
            borderColor: "#f1f5f9",
            borderStyle: "dashed",
          }}
        >
          <Ionicons name="clipboard-outline" size={32} color="#cbd5e1" />
          <Text className="text-sm font-semibold text-slate-400 mt-2">
            No templates yet
          </Text>
          <Text className="text-xs text-slate-300 mt-0.5">
            Tap to create your first template
          </Text>
        </Pressable>
      )}

      {/* List */}
      {!templatesLoading &&
        templates.map((t, i) => (
          <TemplateRow
            key={t.id}
            template={t}
            isLast={i === templates.length - 1}
            onEdit={() => onOpenEdit(t)}
            onDelete={() => onDelete(t)}
          />
        ))}
    </View>
  );
}

/* ── TemplateRow ── */
function TemplateRow({
  template,
  isLast,
  onEdit,
  onDelete,
}: {
  template: WorkoutTemplate;
  isLast: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <View
      className={`flex-row items-center justify-between py-3 ${
        !isLast ? "border-b border-slate-100" : ""
      }`}
    >
      {/* Left */}
      <View className="flex-row items-center gap-x-3 flex-1">
        <View className="w-9 h-9 rounded-xl bg-orange-100 items-center justify-center">
          <Ionicons name="barbell-outline" size={16} color="#f97316" />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-bold text-slate-700">
            {template.name}
          </Text>
          <Text className="text-xs text-slate-400 mt-0.5">
            {template.template_exercises?.length ?? 0} exercises ·{" "}
            {template.estimated_duration}min · {template.category}
          </Text>
        </View>
      </View>

      {/* Edit */}
      <Pressable
        onPress={onEdit}
        className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 items-center justify-center ml-2"
      >
        <Ionicons name="pencil-outline" size={13} color="#94a3b8" />
      </Pressable>

      {/* Delete */}
      <Pressable
        onPress={onDelete}
        className="w-8 h-8 rounded-xl bg-red-50 border border-red-100 items-center justify-center ml-1"
      >
        <Ionicons name="trash-outline" size={13} color="#ef4444" />
      </Pressable>
    </View>
  );
}
