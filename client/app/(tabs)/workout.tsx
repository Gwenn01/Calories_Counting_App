import { useState, useCallback, useEffect, useRef } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// ─── Components ───────────────────────────────────────────────────
import WorkoutHeader from "@/components/Workout/WorkoutHeader";
import TemplateModal from "@/components/Workout/TemplateModal";

// ─── API ──────────────────────────────────────────────────────────
import { fetchWorkoutTemplate } from "@/api/workout";

// ─── Types ────────────────────────────────────────────────────────
import type { WorkoutType, WorkoutTemplate } from "@/types/workout";

// ─── Screen ───────────────────────────────────────────────────────
export default function WorkoutScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);

  // Template modal
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<WorkoutTemplate | null>(null);

  // ── Date navigation ───────────────────────────────────────────
  const goPrevDay = useCallback(() => {
    setCurrentDate((d) => new Date(d.getTime() - 86400000));
  }, []);

  const goNextDay = useCallback(() => {
    setCurrentDate((d) => new Date(d.getTime() + 86400000));
  }, []);

  // ── Fetch templates ───────────────────────────────────────────
  const loadTemplates = useCallback(async () => {
    try {
      setTemplatesLoading(true);
      const data = await fetchWorkoutTemplate();
      // Handle both plain array and paginated { results: [] } response
      setTemplates(Array.isArray(data) ? data : (data?.results ?? []));
    } catch (e) {
      console.error("Failed to fetch templates:", e);
      setTemplates([]); // ← prevent undefined on error
    } finally {
      setTemplatesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTemplates();
  }, []);

  // ── Template handlers ─────────────────────────────────────────
  const handleOpenCreate = useCallback(() => {
    setEditingTemplate(null);
    setShowTemplateModal(true);
  }, []);

  const handleOpenEdit = useCallback((template: WorkoutTemplate) => {
    setEditingTemplate(template);
    setShowTemplateModal(true);
  }, []);

  const handleTemplateSaved = useCallback((saved: WorkoutTemplate) => {
    setTemplates((prev) => {
      const idx = prev.findIndex((t) => t.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [...prev, saved];
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowTemplateModal(false);
    setEditingTemplate(null);
  }, []);

  // ─────────────────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-slate-50 mb-12">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header =========================================================================================================== */}
        <WorkoutHeader
          currentDate={currentDate}
          onPrev={goPrevDay}
          onNext={goNextDay}
        />

        {/* Hero =========================================================================================================== */}
        <View className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 items-center mt-4">
          <View className="w-20 h-20 rounded-[24px] bg-orange-50 border border-orange-100 items-center justify-center mb-5">
            <Ionicons name="barbell-outline" size={36} color="#f97316" />
          </View>
          <Text className="text-xl font-black text-slate-800 mb-2 text-center">
            Ready to Train?
          </Text>
          <Text className="text-sm text-slate-400 text-center leading-5">
            Build your workout templates, then start a session.
          </Text>
        </View>

        {/*Templates =========================================================================================================== */}
        <View className="mt-3 bg-white rounded-[28px] border border-slate-100 shadow-sm p-5">
          {/* Header row */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              My Templates
            </Text>
            <Pressable
              onPress={handleOpenCreate}
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
              onPress={handleOpenCreate}
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

          {/* Template list */}
          {!templatesLoading &&
            templates.map((t, i) => (
              <View
                key={t.id}
                className={`flex-row items-center justify-between py-3 ${
                  i < (templates?.length ?? 0) - 1
                    ? "border-b border-slate-100"
                    : ""
                }`}
              >
                {/* Left */}
                <View className="flex-row items-center gap-x-3 flex-1">
                  <View className="w-9 h-9 rounded-xl bg-orange-100 items-center justify-center">
                    <Ionicons
                      name="barbell-outline"
                      size={16}
                      color="#f97316"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-slate-700">
                      {t.name}
                    </Text>
                    <Text className="text-xs text-slate-400 mt-0.5">
                      {t.template_exercises?.length ?? 0} exercises ·{" "}
                      {t.estimated_duration}min · {t.category}
                    </Text>
                  </View>
                </View>

                {/* Edit button */}
                <Pressable
                  onPress={() => handleOpenEdit(t)}
                  className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 items-center justify-center ml-2"
                >
                  <Ionicons name="pencil-outline" size={13} color="#94a3b8" />
                </Pressable>
              </View>
            ))}
        </View>
      </ScrollView>

      {/* ====================================================================================================== */}
      {/* MODAL */}
      {/* ====================================================================================================== */}
      <TemplateModal
        visible={showTemplateModal}
        onClose={handleCloseModal}
        initialData={editingTemplate}
        onSaved={handleTemplateSaved}
      />
    </SafeAreaView>
  );
}
