import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { WorkoutTemplate } from "@/types/workout";
import { getCategoryMeta } from "./helpers";
import TemplatePreview from "./TemplatePreview";

interface TemplateDropdownProps {
  selected: WorkoutTemplate | null;
  loading: boolean;
  onOpenPicker: () => void;
}

export default function TemplateDropdown({
  selected,
  loading,
  onOpenPicker,
}: TemplateDropdownProps) {
  const meta = selected ? getCategoryMeta(selected.category) : null;

  return (
    <View>
      <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px] mb-2">
        Template
      </Text>

      {/* Trigger */}
      <Pressable
        onPress={onOpenPicker}
        className="flex-row items-center justify-between bg-slate-50 border border-slate-200 rounded-[16px] px-4 py-3.5"
      >
        {selected && meta ? (
          <View className="flex-row items-center gap-3 flex-1">
            <View
              className={`px-2 py-0.5 rounded-full ${meta.bg} border ${meta.border}`}
            >
              <Text
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: meta.color }}
              >
                {meta.label}
              </Text>
            </View>
            <Text
              className="text-sm font-bold text-slate-800 flex-1"
              numberOfLines={1}
            >
              {selected.name}
            </Text>
          </View>
        ) : (
          <Text className="text-sm text-slate-400 flex-1">
            {loading ? "Loading templates…" : "Choose a template…"}
          </Text>
        )}

        {loading ? (
          <ActivityIndicator size="small" color="#94a3b8" />
        ) : (
          <Feather name="chevron-down" size={16} color="#94a3b8" />
        )}
      </Pressable>

      {/* Preview card */}
      {selected && <TemplatePreview template={selected} />}
    </View>
  );
}
