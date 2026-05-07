import { useState, useCallback, useEffect, useRef } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// ─── Components ───────────────────────────────────────────────────
import WorkoutHeader from "@/components/Workout/WorkoutHeader";
import TemplateList from "@/components/Workout/TemplateList";
import TemplateModal from "@/components/Workout/TemplateModal";

// ─── API ──────────────────────────────────────────────────────────
import { fetchWorkoutTemplate, deleteWorkoutTemplate } from "@/api/workout";

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

  const handleDeleteTemplate = useCallback((t: WorkoutTemplate) => {
    Alert.alert(
      "Delete Template",
      `Delete "${t.name}"? This will also remove all its exercises.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteWorkoutTemplate(t.id);
              setTemplates((prev) => prev.filter((item) => item.id !== t.id));
            } catch (e) {
              console.error(e);
            }
          },
        },
      ],
    );
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
        {/* HEADER ===========================================================================================================*/}
        <WorkoutHeader
          currentDate={currentDate}
          onPrev={goPrevDay}
          onNext={goNextDay}
        />

        {/* SESSIONS =========================================================================================================== */}
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

        {/* TEMPLATE =========================================================================================================== */}
        <TemplateList
          templates={templates}
          templatesLoading={templatesLoading}
          onOpenCreate={handleOpenCreate}
          onOpenEdit={handleOpenEdit}
          onDelete={handleDeleteTemplate}
        />
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
