import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { WorkoutTemplate } from "@/types/workout";
import { formatDuration } from "./helpers";

interface TemplatePreviewProps {
  template: WorkoutTemplate;
}

export default function TemplatePreview({ template }: TemplatePreviewProps) {
  const [expanded, setExpanded] = useState(false);
  const exerciseCount = template.template_exercises?.length ?? 0;

  return (
    <View className="mt-2 bg-slate-50 border border-slate-100 rounded-[18px] px-4 py-3">
      {/* Stats row — centered */}
      <View className="flex-row items-center justify-center gap-4 mb-2">
        <View className="flex-row items-center gap-1.5">
          <Feather name="clock" size={12} color="#94a3b8" />
          <Text className="text-xs text-slate-500">
            {formatDuration(template.estimated_duration)}
          </Text>
        </View>
        <View className="w-px h-3 bg-slate-200" />
        <View className="flex-row items-center gap-1.5">
          <Feather name="layers" size={12} color="#94a3b8" />
          <Text className="text-xs text-slate-500">
            {exerciseCount} exercise{exerciseCount !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      {/* Toggle — centered */}
      {exerciseCount > 0 && (
        <View>
          <Pressable
            onPress={() => setExpanded((v) => !v)}
            className="flex-row items-center justify-center gap-1 py-1"
          >
            <Text className="text-[11px] font-semibold text-orange-400">
              {expanded ? "Hide exercises" : "Preview exercises"}
            </Text>
            <Feather
              name={expanded ? "chevron-up" : "chevron-down"}
              size={11}
              color="#f97316"
            />
          </Pressable>

          {/* Exercise rows */}
          {expanded &&
            template.template_exercises?.map((te) => (
              <View
                key={te.id}
                className="flex-row items-center gap-3 bg-white rounded-[12px] px-3 py-2.5 border border-slate-100 mt-2"
              >
                <View className="w-7 h-7 rounded-[8px] bg-orange-50 items-center justify-center">
                  <Feather name="zap" size={13} color="#f97316" />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-xs font-bold text-slate-800"
                    numberOfLines={1}
                  >
                    {te.exercise.name}
                  </Text>
                  <Text className="text-[10px] text-slate-400">
                    {te.default_sets}×{te.default_reps} · {te.default_weight}kg
                  </Text>
                </View>
                <View className="bg-slate-100 rounded-full px-2 py-0.5">
                  <Text className="text-[9px] font-bold text-slate-500 capitalize">
                    {te.exercise.muscle_group}
                  </Text>
                </View>
              </View>
            ))}
        </View>
      )}
    </View>
  );
}
