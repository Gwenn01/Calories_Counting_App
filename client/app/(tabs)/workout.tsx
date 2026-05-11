import { useState, useCallback, useEffect, useRef } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useToast } from "@/components/ToastProvider";

// ─── Components ───────────────────────────────────────────────────
import WorkoutHeader from "@/components/Workout/WorkoutHeader";
import StartSessionCard from "@/components/Workout/StartSessionCard";
import TemplateList from "@/components/Workout/TemplateList";
import TemplateModal from "@/components/Workout/TemplateModal";

// ─── API ──────────────────────────────────────────────────────────
import {
  fetchWorkoutTemplate,
  createWorkoutSession,
  deleteWorkoutTemplate,
} from "@/api/workout";

// ─── Types ────────────────────────────────────────────────────────
import type { WorkoutType, WorkoutTemplate } from "@/types/workout";

// ─── Screen ───────────────────────────────────────────────────────
export default function WorkoutScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);

  const { showToast } = useToast();

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

  const handleDeleteTemplate = useCallback(async (t: WorkoutTemplate) => {
    try {
      await deleteWorkoutTemplate(t.id);
      setTemplates((prev) => prev.filter((item) => item.id !== t.id));
      showToast("Success!", "Template deleted", "success");
    } catch (e) {
      console.error(e);
      showToast("Error", "Failed to delete template", "error");
    }
  }, []);

  // session creation  ───────────────────────────────────────────
  const handleStartSession = async (payload: {
    template: number;
    notes: string;
    energy_level: number;
    mood_rating: number;
  }) => {
    try {
      const session = await createWorkoutSession(payload);
      showToast("Session started!", "Go crush it", "success");
    } catch (e) {
      console.error(e);

      showToast("Error", "Failed to start session", "error");
    }
  };

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

        {/* CREATE SESSIONS =========================================================================================================== */}
        <StartSessionCard
          templates={templates}
          templatesLoading={templatesLoading}
          onStartSession={handleStartSession}
        />

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
