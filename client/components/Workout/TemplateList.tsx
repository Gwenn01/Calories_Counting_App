// components/Workout/TemplateList.tsx
import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import type { WorkoutTemplate } from "@/types/workout";
import { useAlert } from "@/components/AlertProvider";
import { TemplateListProps } from "@/types/workout";
import { CATEGORY_META } from "@/constants/workout";

export default function TemplateList({
  templates,
  templatesLoading,
  onOpenCreate,
  onOpenEdit,
  onDelete,
}: TemplateListProps) {
  const { showAlert } = useAlert();

  const confirmDelete = (t: WorkoutTemplate) => {
    showAlert(
      "Delete Template",
      `Delete "${t.name}"? This will also remove all its exercises.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(t),
        },
      ],
    );
  };

  return (
    <View
      className="mt-3 bg-white rounded-[28px] p-5"
      style={{
        borderWidth: 1,
        borderColor: "#f1f5f9",
        shadowColor: "#94a3b8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 4,
      }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          My Templates
        </Text>
        <Pressable
          onPress={onOpenCreate}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
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
          style={({ pressed }) => ({
            opacity: pressed ? 0.8 : 1,
            borderWidth: 2,
            borderColor: "#f1f5f9",
            borderStyle: "dashed",
            borderRadius: 16,
            padding: 32,
            alignItems: "center",
          })}
        >
          <View className="w-12 h-12 rounded-[16px] bg-orange-50 border border-orange-100 items-center justify-center mb-3">
            <Ionicons name="clipboard-outline" size={24} color="#f97316" />
          </View>
          <Text className="text-sm font-bold text-slate-500 mb-0.5">
            No templates yet
          </Text>
          <Text className="text-xs text-slate-400 text-center">
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
            onDelete={() => confirmDelete(t)}
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
  const meta = CATEGORY_META[template.category] ?? {
    color: "#64748b",
    bg: "#f8fafc",
    border: "#e2e8f0",
  };

  return (
    <View
      className={`flex-row items-center py-3 ${
        !isLast ? "border-b border-slate-100" : ""
      }`}
    >
      {/* Category icon */}
      <View
        className="w-10 h-10 rounded-[14px] items-center justify-center mr-3"
        style={{
          backgroundColor: meta.bg,
          borderWidth: 1,
          borderColor: meta.border,
        }}
      >
        <Ionicons name="barbell-outline" size={17} color={meta.color} />
      </View>

      {/* Info */}
      <View className="flex-1">
        <View className="flex-row items-center gap-x-2 mb-0.5">
          <Text className="text-sm font-bold text-slate-700">
            {template.name}
          </Text>
          <View
            className="px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: meta.bg }}
          >
            <Text
              className="text-[9px] font-bold capitalize"
              style={{ color: meta.color }}
            >
              {template.category.replace("_", " ")}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-x-2 mt-0.5">
          <View className="flex-row items-center gap-x-1">
            <Feather name="layers" size={9} color="#94a3b8" />
            <Text className="text-[10px] text-slate-400 font-medium">
              {template.template_exercises?.length ?? 0} exercises
            </Text>
          </View>
          <View className="w-0.5 h-0.5 rounded-full bg-slate-300" />
          <View className="flex-row items-center gap-x-1">
            <Feather name="clock" size={9} color="#94a3b8" />
            <Text className="text-[10px] text-slate-400 font-medium">
              {template.estimated_duration}min
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row items-center gap-x-1.5 ml-2">
        <Pressable
          onPress={onEdit}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 items-center justify-center"
        >
          <Feather name="edit-2" size={12} color="#94a3b8" />
        </Pressable>
        <Pressable
          onPress={onDelete}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          className="w-8 h-8 rounded-xl bg-red-50 border border-red-100 items-center justify-center"
        >
          <Feather name="trash-2" size={12} color="#ef4444" />
        </Pressable>
      </View>
    </View>
  );
}
