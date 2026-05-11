import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { WorkoutTemplate } from "@/types/workout";
import { getCategoryMeta, formatDuration } from "./helpers";
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
    <View className="w-full">
      <Pressable
        onPress={onOpenPicker}
        className="flex-row items-center justify-between bg-slate-50 border border-slate-200 rounded-[18px] px-4 py-4"
      >
        {/* Left icon */}
        <View className="w-10 h-10 rounded-[12px] bg-white border border-slate-100 items-center justify-center">
          {loading ? (
            <ActivityIndicator size="small" color="#f97316" />
          ) : (
            <Feather
              name={selected ? "check-square" : "grid"}
              size={16}
              color="#f97316"
            />
          )}
        </View>

        {/* Center text */}
        <View className="flex-1 items-center px-3">
          {selected && meta ? (
            <View className="items-center">
              <Text
                className="text-sm font-black text-slate-800 mb-1 text-center"
                numberOfLines={1}
              >
                {selected.name}
              </Text>
              <View className="flex-row items-center gap-2">
                <View
                  className="px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: meta.color + "20",
                    borderWidth: 1,
                    borderColor: meta.color + "40",
                  }}
                >
                  <Text
                    className="text-[9px] font-bold uppercase tracking-widest"
                    style={{ color: meta.color }}
                  >
                    {meta.label}
                  </Text>
                </View>
                <Text className="text-[11px] text-slate-400">
                  {formatDuration(selected.estimated_duration)}
                </Text>
                <Text className="text-[11px] text-slate-300">·</Text>
                <Text className="text-[11px] text-slate-400">
                  {selected.template_exercises?.length ?? 0} exercises
                </Text>
              </View>
            </View>
          ) : (
            <View className="items-center">
              <Text className="text-sm font-bold text-orange-400 text-center">
                {loading ? "Loading templates…" : "Choose a template"}
              </Text>
              <Text className="text-[11px] text-slate-400 mt-0.5 text-center">
                Tap to browse your templates
              </Text>
            </View>
          )}
        </View>

        {/* Right chevron */}
        <View className="w-10 h-10 rounded-[12px] bg-white border border-slate-100 items-center justify-center">
          <Feather name="chevron-down" size={14} color="#f97316" />
        </View>
      </Pressable>

      {/* Preview card */}
      {selected && <TemplatePreview template={selected} />}
    </View>
  );
}
