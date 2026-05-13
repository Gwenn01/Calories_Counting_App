import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
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
import type { WorkoutSession } from "@/types/workout";

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

  const handleFinish = async () => {
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
  };

  const handleDelete = async () => {
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
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="text-sm text-slate-400 mt-3">Loading session…</Text>
      </SafeAreaView>
    );
  }

  if (!session) return null;

  const completedSets = session.workout_exercises.reduce(
    (acc, we) => acc + we.sets.filter((s) => s.completed).length,
    0,
  );
  const totalSets = session.workout_exercises.reduce(
    (acc, we) => acc + we.sets.length,
    0,
  );
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <SessionHeader
          weightUnit={session.weight_unit}
          session={session}
          onBack={() => router.back()}
        />

        <View className="px-1">
          {/* ── Timer ── */}
          <SessionTimer startTime={session.start_time} />

          {/* ── Progress ── */}
          <SessionProgress
            completedSets={completedSets}
            totalSets={totalSets}
          />

          {/* ── Exercise cards ── */}
          {session.workout_exercises.map((we) => (
            <ExerciseCard
              weightUnit={session.weight_unit}
              key={we.id}
              workoutExercise={we}
              sessionId={session.id}
              onUpdate={loadSession}
            />
          ))}

          {/* ── Add exercise ── */}
          <Pressable
            onPress={() => setShowAddExercise(true)}
            className="items-center justify-center bg-white border border-dashed border-slate-300 rounded-[16px] py-2 mb-4"
          >
            <Feather name="plus-circle" size={16} color="#94a3b8" />
            <Text className="text-sm font-bold text-slate-400">
              Add exercise
            </Text>
          </Pressable>

          {/* ── Finish button — inline, bottom of scroll ── */}
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

          {/* Extra bottom delete session*/}
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
      </ScrollView>

      <AddExerciseModal
        category={session.category}
        visible={showAddExercise}
        sessionId={session.id}
        onClose={() => setShowAddExercise(false)}
        onAdded={loadSession}
      />
    </SafeAreaView>
  );
}
