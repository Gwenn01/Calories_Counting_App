import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { WorkoutTemplate } from "@/types/workout";

import TemplateDropdown from "@/components/Workout/StartSessionCardContainer/TemplateDropdown";
import TemplatePickerModal from "@/components/Workout/StartSessionCardContainer/TemplatePickerModal";
import RatingSlider from "@/components/Workout/StartSessionCardContainer/RatingSlider";
import { StartSessionCardProps } from "@/types/workout";

export default function StartSessionCard({
  templates,
  templatesLoading = false,
  disabled = false,
  onStartSession,
}: StartSessionCardProps) {
  const [selectedTemplate, setSelectedTemplate] =
    useState<WorkoutTemplate | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [energyLevel, setEnergyLevel] = useState(7);
  const [moodRating, setMoodRating] = useState(7);
  const [submitting, setSubmitting] = useState(false);

  const handleStart = async () => {
    if (!selectedTemplate) return;
    try {
      setSubmitting(true);
      await onStartSession({
        template: selectedTemplate.id,
        notes,
        energy_level: energyLevel,
        mood_rating: moodRating,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden mt-4">
      {/* ── Hero ── */}
      <View className="bg-slate-900 px-8 pt-8 pb-7 items-center">
        {/* Top label */}
        <View className="flex-row items-center gap-1.5 mb-5">
          <Feather name="activity" size={11} color="#f97316" />
          <Text className="text-[10px] font-bold tracking-[2px] uppercase text-orange-400">
            Workout Session
          </Text>
        </View>

        {/* Icon */}
        <View className="w-16 h-16 rounded-[20px] bg-orange-500 items-center justify-center mb-5 shadow-lg">
          <Ionicons name="barbell-outline" size={30} color="#fff" />
        </View>

        {/* Text */}
        <Text
          className="text-2xl font-black text-white text-center mb-2"
          style={{ letterSpacing: -0.5 }}
        >
          Ready to Train?
        </Text>
        <Text className="text-sm text-slate-400 text-center leading-5">
          Pick a template and log how you feel.
        </Text>
      </View>

      {/* ── Divider ── */}
      <View className="h-px bg-slate-100 mx-6" />

      {/* ── Form ── */}
      <View className="px-3 pt-3 pb-6">
        <TemplateDropdown
          selected={selectedTemplate}
          loading={templatesLoading}
          onOpenPicker={() => setDropdownOpen(true)}
        />

        <View className="h-px bg-slate-100" />

        <RatingSlider
          label="Energy Level"
          icon="zap"
          value={energyLevel}
          onChange={setEnergyLevel}
          activeColor="#f97316"
        />

        <RatingSlider
          label="Mood"
          icon="smile"
          value={moodRating}
          onChange={setMoodRating}
          activeColor="#8b5cf6"
        />

        <View className="h-px bg-slate-100" />

        {/* Notes */}
        <View>
          <View className="flex-row items-center gap-1.5 mb-2">
            <Feather name="edit-3" size={11} color="#94a3b8" />
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">
              Notes (optional)
            </Text>
          </View>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Strong today, feeling fired up…"
            placeholderTextColor="#cbd5e1"
            multiline
            numberOfLines={2}
            className="bg-slate-50 border border-slate-200 rounded-[16px] px-4 py-3 text-sm text-slate-800 mb-3"
            style={{ textAlignVertical: "top", minHeight: 64 }}
          />
        </View>
        {/* Start Button */}
        <Pressable
          onPress={handleStart}
          disabled={!selectedTemplate || submitting || disabled}
          className="rounded-[16px] overflow-hidden"
          style={{ opacity: !selectedTemplate || submitting ? 0.5 : 1 }}
        >
          <View className="bg-slate-900 px-6 py-4 flex-row items-center justify-center gap-2.5">
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View className="flex-row items-center gap-2.5">
                <Ionicons name="barbell-outline" size={18} color="#fff" />
                <Text className="text-sm font-black text-white tracking-wide uppercase">
                  Start Session
                </Text>
              </View>
            )}
          </View>
        </Pressable>
      </View>

      {/* ── Picker modal ── */}
      <TemplatePickerModal
        visible={dropdownOpen}
        templates={templates}
        selected={selectedTemplate}
        onSelect={(t) => {
          setSelectedTemplate(t);
          setDropdownOpen(false);
        }}
        onClose={() => setDropdownOpen(false)}
      />
    </View>
  );
}
