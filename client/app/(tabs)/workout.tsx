import { useState, useCallback, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";
import { useToast } from "@/components/ToastProvider";
import { router, useFocusEffect } from "expo-router";

// ─── Components ───────────────────────────────────────────────────
import WorkoutHeader from "@/components/Workout/WorkoutHeader";
import StartSessionCard from "@/components/Workout/StartSessionCard";
import TemplateList from "@/components/Workout/TemplateList";
import TemplateModal from "@/components/Workout/TemplateModal";
import SessionDayCard from "@/components/Workout/SessionDayCard";

// ─── API ──────────────────────────────────────────────────────────
import {
  fetchWorkoutTemplate,
  createWorkoutSession,
  deleteWorkoutTemplate,
  fetchSessionsByDate,
} from "@/api/workout";

// ─── Types ────────────────────────────────────────────────────────
import type {
  WorkoutType,
  WorkoutTemplate,
  WorkoutSession,
} from "@/types/workout";

// helper to format duration in minutes/hours
const toDateString = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// ─── Screen ───────────────────────────────────────────────────────
export default function WorkoutScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  // templates data
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  // session data
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  // date data
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentDay = new Date(currentDate);
  currentDay.setHours(0, 0, 0, 0);

  const isToday = currentDay.getTime() === today.getTime();
  const isPast = currentDay.getTime() < today.getTime();
  const todaySession = sessions[0] ?? null;

  const { showToast } = useToast();
  // Template modal
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<WorkoutTemplate | null>(null);

  // ── Date navigation ───────────────────────────────────────────
  const goPrevDay = useCallback(() => {
    setSessions([]); // ← clear immediately
    setCurrentDate((d) => new Date(d.getTime() - 86400000));
  }, []);

  const goNextDay = useCallback(() => {
    setSessions([]); // ← clear immediately
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

  // ── Fetch sessions for the day ───────────────────────────────────────────
  const loadSessions = useCallback(async (date: Date) => {
    try {
      setSessionsLoading(true);
      setSessions([]);
      const dateStr = toDateString(date);
      const data = await fetchSessionsByDate(dateStr);
      if (!data) {
        setSessions([]);
      } else if (Array.isArray(data)) {
        setSessions(data);
      } else {
        setSessions([data]);
      }
    } catch (e) {
      console.error(e);
      setSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTemplates();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSessions(currentDate);
    }, [currentDate]),
  );

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
      showToast("Session started!", "Go crush it ", "success");
      router.push({
        pathname: "/workout/session/[id]",
        params: { id: session.id },
      });
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
        {sessionsLoading ? (
          <View className="bg-white rounded-[24px] border border-slate-100 mt-4 py-12 items-center">
            <ActivityIndicator size="small" color="#f97316" />
            <Text className="text-xs text-slate-400 mt-2">
              Loading session…
            </Text>
          </View>
        ) : todaySession ? (
          <SessionDayCard session={todaySession} isToday={isToday} />
        ) : isPast ? (
          // past date with no session
          <View className="bg-white rounded-[24px] border border-slate-100 mt-4 py-10 items-center px-6">
            <View className="w-14 h-14 rounded-[16px] bg-slate-100 items-center justify-center mb-4">
              <Feather name="calendar" size={24} color="#94a3b8" />
            </View>
            <Text className="text-base font-black text-slate-700 mb-1">
              No Session
            </Text>
            <Text className="text-sm text-slate-400 text-center leading-5">
              No workout was logged on this day.
            </Text>
          </View>
        ) : (
          // today or future with no session → allow starting
          <StartSessionCard
            templates={templates}
            templatesLoading={templatesLoading}
            onStartSession={handleStartSession}
          />
        )}

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
