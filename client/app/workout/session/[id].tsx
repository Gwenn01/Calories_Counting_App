import { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import {
  fetchWorkoutSession,
  finishWorkoutSession,
  deleteWorkoutSession,
} from "@/api/workout";
import { useToast } from "@/components/ToastProvider";
import { useAlert } from "@/components/AlertProvider";
import SessionHeader from "@/components/Workout/SessionHeader";
import SessionTimer from "@/components/Workout/SessionTimer";
import SessionProgress from "@/components/Workout/SessionProgress";
import ExerciseCard from "@/components/Workout/SessionExerciseCard";
import AddExerciseModal from "@/components/Workout/AddExerciseModal";
import type { WorkoutSession, WorkoutExercise } from "@/types/workout";

// ── Extracted so FlatList renderItem doesn't recreate it inline ──────────────
type ListItem =
  | { type: "header" }
  | { type: "exercise"; data: WorkoutExercise }
  | { type: "footer" };

export default function ActiveSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showToast } = useToast();
  const { showAlert } = useAlert();
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [finishing, setFinishing] = useState(false);
  const [showAddExercise, setShowAddExercise] = useState(false);

  const loadSession = useCallback(async () => {
    try {
      const data = await fetchWorkoutSession(Number(id));
      setSession(data);
    } catch (e) {
      console.error(e);
      showToast("Error", "Failed to load session", "error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadSession();
  }, []);

  // ── Memoized derived stats ─────────────────────────────────────────────────
  const completedSets = useMemo(
    () =>
      session?.workout_exercises.reduce(
        (acc, we) => acc + we.sets.filter((s) => s.completed).length,
        0,
      ) ?? 0,
    [session?.workout_exercises],
  );

  const totalSets = useMemo(
    () =>
      session?.workout_exercises.reduce((acc, we) => acc + we.sets.length, 0) ??
      0,
    [session?.workout_exercises],
  );

  // ── Stable handlers ────────────────────────────────────────────────────────
  const handleFinish = useCallback(async () => {
    if (!session) return;
    try {
      setFinishing(true);
      await finishWorkoutSession(session.id);
      showToast("Done!", "Session finished 💪", "success");
      router.back();
    } catch (e) {
      showToast("Error", "Failed to finish session", "error");
    } finally {
      setFinishing(false);
    }
  }, [session, showToast]);

  const handleDelete = useCallback(async () => {
    showAlert(
      "Delete Session",
      "Are you sure you want to delete this session? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (!session) return;
            try {
              await deleteWorkoutSession(session.id);
              showToast("Done!", "Session deleted 🗑️", "success");
              router.back();
            } catch (e) {
              showToast("Error", "Failed to delete session", "error");
            }
          },
        },
      ],
    );
  }, [session, showAlert, showToast]);

  const handleOpenAddExercise = useCallback(() => setShowAddExercise(true), []);

  const handleCloseAddExercise = useCallback(
    () => setShowAddExercise(false),
    [],
  );

  // ── FlatList data: header + exercises + footer as one list ─────────────────
  const listItems = useMemo<ListItem[]>(() => {
    if (!session) return [];
    return [
      { type: "header" },
      ...session.workout_exercises.map((we) => ({
        type: "exercise" as const,
        data: we,
      })),
      { type: "footer" },
    ];
  }, [session]);

  // ── renderItem (memoized, no inline closures) ──────────────────────────────
  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === "header") {
        return (
          <View className="">
            <SessionHeader
              weightUnit={session!.weight_unit}
              session={session!}
              onBack={() => router.back()}
            />
            <SessionTimer startTime={session!.start_time} />
            <SessionProgress
              completedSets={completedSets}
              totalSets={totalSets}
            />
          </View>
        );
      }

      if (item.type === "exercise") {
        return (
          <ExerciseCard
            weightUnit={session!.weight_unit}
            workoutExercise={item.data}
            sessionId={session!.id}
            onUpdate={loadSession}
          />
        );
      }

      // footer
      return (
        <View className="px-1">
          <Pressable
            onPress={handleOpenAddExercise}
            className="items-center justify-center bg-white border border-dashed border-slate-300 rounded-[16px] py-2 mb-4"
          >
            <Feather name="plus-circle" size={16} color="#94a3b8" />
            <Text className="text-sm font-bold text-slate-400">
              Add exercise
            </Text>
          </Pressable>

          <Pressable
            onPress={handleFinish}
            disabled={finishing}
            className="bg-slate-900 rounded-[18px] py-4 items-center justify-center"
            style={{ opacity: finishing ? 0.6 : 1 }}
          >
            {finishing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View className="flex-row items-center gap-2.5">
                <Feather name="check-circle" size={18} color="#fff" />
                <Text className="text-sm font-black text-white uppercase tracking-wide">
                  Finish Session
                </Text>
              </View>
            )}
          </Pressable>

          <Pressable
            onPress={handleDelete}
            disabled={finishing}
            className="bg-red-600 rounded-[18px] py-4 items-center justify-center mt-4"
            style={{ opacity: finishing ? 0.6 : 1 }}
          >
            {finishing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View className="flex-row items-center gap-2.5">
                <Feather name="trash-2" size={18} color="#fff" />
                <Text className="text-sm font-black text-white uppercase tracking-wide">
                  Delete Session
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      );
    },
    [
      session,
      completedSets,
      totalSets,
      finishing,
      loadSession,
      handleFinish,
      handleDelete,
      handleOpenAddExercise,
    ],
  );

  const keyExtractor = useCallback((item: ListItem, index: number) => {
    if (item.type === "exercise") return `exercise-${item.data.id}`;
    return `${item.type}-${index}`;
  }, []);

  // ── Loading / empty states ─────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="text-sm text-slate-400 mt-3">Loading session…</Text>
      </SafeAreaView>
    );
  }

  if (!session) return null;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <FlatList
        data={listItems}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        // ── Performance tuning ──
        removeClippedSubviews={true}
        maxToRenderPerBatch={4}
        windowSize={5}
        initialNumToRender={3}
        updateCellsBatchingPeriod={50}
      />

      <AddExerciseModal
        category={session.category}
        visible={showAddExercise}
        sessionId={session.id}
        onClose={handleCloseAddExercise}
        onAdded={loadSession}
      />
    </SafeAreaView>
  );
}
