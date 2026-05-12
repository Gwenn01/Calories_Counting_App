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
import { fetchWorkoutSession, finishWorkoutSession } from "@/api/workout";
import { useToast } from "@/components/ToastProvider";
import SessionHeader from "@/components/Workout/SessionHeader";
import SessionTimer from "@/components/Workout//SessionTimer";
import ExerciseCard from "@/components/Workout/ExerciseCard";
import AddExerciseModal from "@/components/Workout/AddExerciseModal";
import type { WorkoutSession } from "@/types/workout";

export default function ActiveSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showToast } = useToast();

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
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <SessionHeader session={session} onBack={() => router.back()} />

        {/* Timer */}
        <SessionTimer startTime={session.start_time} />

        {/* Stats strip */}
        <View className="flex-row mx-4 mb-4 gap-3">
          <View className="flex-1 bg-white border border-slate-100 rounded-[16px] px-3 py-3 items-center">
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Sets
            </Text>
            <Text className="text-lg font-black text-slate-800">
              {completedSets}
              <Text className="text-xs font-bold text-slate-300">
                /{totalSets}
              </Text>
            </Text>
          </View>
          <View className="flex-1 bg-white border border-slate-100 rounded-[16px] px-3 py-3 items-center">
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Volume
            </Text>
            <Text className="text-lg font-black text-slate-800">
              {session.total_volume}
              <Text className="text-xs font-bold text-slate-400"> kg</Text>
            </Text>
          </View>
          <View className="flex-1 bg-white border border-slate-100 rounded-[16px] px-3 py-3 items-center">
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Exercises
            </Text>
            <Text className="text-lg font-black text-slate-800">
              {session.workout_exercises.length}
            </Text>
          </View>
        </View>

        {/* Exercise cards */}
        <View className="px-4 gap-4">
          {session.workout_exercises.map((we) => (
            <ExerciseCard
              key={we.id}
              workoutExercise={we}
              sessionId={session.id}
              onUpdate={loadSession}
            />
          ))}
        </View>

        {/* Add Exercise button */}
        <Pressable
          onPress={() => setShowAddExercise(true)}
          className="mx-4 mt-4 flex-row items-center justify-center gap-2 bg-white border border-dashed border-slate-300 rounded-[18px] py-4"
        >
          <Feather name="plus-circle" size={16} color="#94a3b8" />
          <Text className="text-sm font-bold text-slate-400">Add Exercise</Text>
        </Pressable>
      </ScrollView>

      {/* Finish button — fixed bottom */}
      <View className="absolute bottom-0 left-0 right-0 px-4 pb-8 pt-4 bg-slate-50 border-t border-slate-100">
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
      </View>

      <AddExerciseModal
        visible={showAddExercise}
        sessionId={session.id}
        onClose={() => setShowAddExercise(false)}
        onAdded={loadSession}
      />
    </SafeAreaView>
  );
}
