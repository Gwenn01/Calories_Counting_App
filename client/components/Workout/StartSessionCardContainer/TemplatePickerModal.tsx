import { View, Text, Pressable, ScrollView, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import { WorkoutTemplate } from "@/types/workout";
import { getCategoryMeta, formatDuration } from "./helpers";

interface TemplatePickerModalProps {
  visible: boolean;
  templates: WorkoutTemplate[];
  selected: WorkoutTemplate | null;
  onSelect: (t: WorkoutTemplate) => void;
  onClose: () => void;
}

export default function TemplatePickerModal({
  visible,
  templates,
  selected,
  onSelect,
  onClose,
}: TemplatePickerModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/40 justify-end" onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View className="bg-white rounded-t-[32px] px-5 pt-5 pb-8">
            {/* Handle */}
            <View className="w-10 h-1 rounded-full bg-slate-200 self-center mb-5" />

            <Text className="text-base font-black text-slate-800 mb-1">
              Choose Template
            </Text>
            <Text className="text-xs text-slate-400 mb-5">
              {templates.length} template{templates.length !== 1 ? "s" : ""}{" "}
              available
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 380 }}
              contentContainerStyle={{ gap: 10 }}
            >
              {templates.length === 0 ? (
                <View className="items-center py-10">
                  <Feather name="inbox" size={32} color="#cbd5e1" />
                  <Text className="text-sm text-slate-400 mt-3">
                    No templates yet
                  </Text>
                </View>
              ) : (
                templates.map((t) => {
                  const m = getCategoryMeta(t.category);
                  const isSelected = selected?.id === t.id;

                  return (
                    <Pressable
                      key={t.id}
                      onPress={() => onSelect(t)}
                      className={`flex-row items-center gap-4 rounded-[18px] px-4 py-4 border ${
                        isSelected
                          ? "bg-slate-900 border-slate-900"
                          : "bg-slate-50 border-slate-100"
                      }`}
                    >
                      {/* Category icon */}
                      <View
                        className="w-10 h-10 rounded-[12px] items-center justify-center"
                        style={{ backgroundColor: m.color + "20" }}
                      >
                        <View
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: m.color }}
                        />
                      </View>

                      {/* Info */}
                      <View className="flex-1">
                        <Text
                          className={`text-sm font-black ${
                            isSelected ? "text-white" : "text-slate-800"
                          }`}
                          numberOfLines={1}
                        >
                          {t.name}
                        </Text>
                        <View className="flex-row items-center gap-2 mt-0.5">
                          <Text
                            className={`text-[11px] ${isSelected ? "text-slate-300" : "text-slate-400"}`}
                          >
                            {formatDuration(t.estimated_duration)}
                          </Text>
                          <Text
                            className={`text-[11px] ${isSelected ? "text-slate-300" : "text-slate-400"}`}
                          >
                            ·
                          </Text>
                          <Text
                            className={`text-[11px] ${isSelected ? "text-slate-300" : "text-slate-400"}`}
                          >
                            {t.template_exercises?.length ?? 0} exercise
                            {(t.template_exercises?.length ?? 0) !== 1
                              ? "s"
                              : ""}
                          </Text>
                        </View>
                      </View>

                      {/* Category badge */}
                      <View
                        className="px-2.5 py-1 rounded-full border"
                        style={{
                          backgroundColor: isSelected
                            ? "rgba(255,255,255,0.15)"
                            : m.color + "15",
                          borderColor: isSelected
                            ? "#ffffff33"
                            : m.color + "44",
                        }}
                      >
                        <Text
                          className="text-[10px] font-bold uppercase tracking-widest"
                          style={{ color: isSelected ? "#fff" : m.color }}
                        >
                          {m.label}
                        </Text>
                      </View>

                      {isSelected && (
                        <Feather name="check" size={16} color="#fff" />
                      )}
                    </Pressable>
                  );
                })
              )}
            </ScrollView>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
