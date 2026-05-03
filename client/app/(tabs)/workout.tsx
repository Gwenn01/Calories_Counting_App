import { useState, useCallback, useEffect, useRef } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// ─── Components ───────────────────────────────────────────────────
import WorkoutHeader from "@/components/Workout/WorkoutHeader";
import ExerciseCard from "@/components/Workout/ExerciseCard";
import RestTimer from "@/components/Workout/RestTimer";
import SummaryExerciseCard from "@/components/Workout/SummaryExerciseCard";
import AddExerciseModal from "@/components/Workout/AddExerciseModal";
import WorkoutTypePicker from "@/components/Workout/WorkoutTypePicker";

// ─── Utils ────────────────────────────────────────────────────────
import {
  newExercise,
  newSet,
  fmtTime,
  calcTotalSets,
  calcTotalVolume,
} from "@/helpers/workout";
import { DEFAULT_REST } from "@/constants/workout";
import type { WorkoutType, ScreenState, Exercise } from "@/types/workout";

// ─── Quick-start template labels ─────────────────────────────────
const QUICK_STARTS: { label: string; type: WorkoutType }[] = [
  { label: "Push Day A", type: "Push" },
  { label: "Pull Day B", type: "Pull" },
  { label: "Leg Day", type: "Legs" },
];

// ─── Screen ───────────────────────────────────────────────────────
export default function WorkoutScreen() {
  const [screen, setScreen] = useState<ScreenState>("empty");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workoutType, setWorkoutType] = useState<WorkoutType>("Push");
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const [showAddExercise, setShowAddExercise] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);

  // Rest timer
  const [restRemaining, setRestRemaining] = useState(DEFAULT_REST);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Elapsed workout time
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Date navigation ───────────────────────────────────────────
  const goPrevDay = useCallback(() => {
    setCurrentDate((d) => new Date(d.getTime() - 86400000));
  }, []);

  const goNextDay = useCallback(() => {
    setCurrentDate((d) => new Date(d.getTime() + 86400000));
  }, []);

  // ── Rest timer ────────────────────────────────────────────────
  const startRestTimer = useCallback(() => {
    setRestRemaining(DEFAULT_REST);
    setScreen("rest");
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setRestRemaining((r) => {
        if (r <= 1) {
          clearInterval(timerRef.current!);
          setScreen("active");
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  }, []);

  const stopRestTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setScreen("active");
  }, []);

  // ── Elapsed clock ─────────────────────────────────────────────
  useEffect(() => {
    if (screen === "active" || screen === "rest") {
      if (!elapsedRef.current) {
        elapsedRef.current = setInterval(() => {
          setElapsed((e) => e + 1);
        }, 1000);
      }
    } else {
      if (elapsedRef.current) {
        clearInterval(elapsedRef.current);
        elapsedRef.current = null;
      }
    }
    // Cleanup on unmount
    return () => {
      if (elapsedRef.current) clearInterval(elapsedRef.current);
    };
  }, [screen]);

  // ── Workout lifecycle ─────────────────────────────────────────
  const startWorkout = useCallback((type?: WorkoutType) => {
    if (type) setWorkoutType(type);
    setExercises([]);
    setElapsed(0);
    setScreen("active");
  }, []);

  const finishWorkout = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setScreen("summary");
  }, []);

  const resetWorkout = useCallback(() => {
    setScreen("empty");
    setExercises([]);
    setElapsed(0);
  }, []);

  // ── Exercise mutations ────────────────────────────────────────
  const addExercise = useCallback((name: string) => {
    setExercises((prev) => [...prev, newExercise(name)]);
  }, []);

  const addSet = useCallback((exId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exId) return ex;
        const last = ex.sets.at(-1);
        return {
          ...ex,
          sets: [...ex.sets, newSet(last?.weight, last?.reps)],
        };
      }),
    );
  }, []);

  const updateSet = useCallback(
    (exId: string, setId: string, field: "weight" | "reps", value: string) => {
      setExercises((prev) =>
        prev.map((ex) =>
          ex.id !== exId
            ? ex
            : {
                ...ex,
                sets: ex.sets.map((s) =>
                  s.id === setId ? { ...s, [field]: value } : s,
                ),
              },
        ),
      );
    },
    [],
  );

  const completeSet = useCallback(
    (exId: string, setId: string) => {
      // Read current done state before toggling
      setExercises((prev) => {
        const wasAlreadyDone =
          prev.find((e) => e.id === exId)?.sets.find((s) => s.id === setId)
            ?.done ?? false;

        const next = prev.map((ex) =>
          ex.id !== exId
            ? ex
            : {
                ...ex,
                sets: ex.sets.map((s) =>
                  s.id === setId ? { ...s, done: !s.done } : s,
                ),
              },
        );

        // Only trigger rest timer when marking as DONE (not undoing)
        if (!wasAlreadyDone) {
          // Defer so state update settles first
          setTimeout(() => startRestTimer(), 0);
        }

        return next;
      });
    },
    [startRestTimer],
  );

  const toggleFavorite = useCallback((exId: string) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exId ? { ...ex, isFavorite: !ex.isFavorite } : ex,
      ),
    );
  }, []);

  const updateNotes = useCallback((exId: string, val: string) => {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === exId ? { ...ex, notes: val } : ex)),
    );
  }, []);

  // ── Derived summary values ────────────────────────────────────
  const totalSets = calcTotalSets(exercises);
  const totalVolume = calcTotalVolume(exercises);
  const completedExercises = exercises.filter((ex) =>
    ex.sets.some((s) => s.done),
  );

  // ─────────────────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-slate-50 mb-12">
      {/* ══════════════════════════════════════════════════════════
          EMPTY STATE
      ══════════════════════════════════════════════════════════ */}
      {screen === "empty" && (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          <WorkoutHeader
            currentDate={currentDate}
            workoutType={workoutType}
            onPrev={goPrevDay}
            onNext={goNextDay}
            onTypeChange={() => setShowTypePicker(true)}
          />

          {/* Hero card */}
          <View className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 items-center mt-4">
            <View className="w-20 h-20 rounded-[24px] bg-orange-50 border border-orange-100 items-center justify-center mb-5">
              <Ionicons name="barbell-outline" size={36} color="#f97316" />
            </View>

            <Text className="text-xl font-black text-slate-800 mb-2 text-center">
              Ready to Train?
            </Text>
            <Text className="text-sm text-slate-400 text-center leading-5 mb-8">
              Start a new session and track your exercises, sets, and reps.
            </Text>

            {/* Quick-start list */}
            <View className="w-full bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Quick Start
              </Text>
              {QUICK_STARTS.map(({ label, type }, i) => (
                <Pressable
                  key={label}
                  onPress={() => startWorkout(type)}
                  className={`flex-row items-center justify-between py-2.5 ${
                    i < QUICK_STARTS.length - 1
                      ? "border-b border-slate-100"
                      : ""
                  }`}
                >
                  <View className="flex-row items-center gap-x-3">
                    <View className="w-7 h-7 rounded-lg bg-orange-100 items-center justify-center">
                      <Ionicons
                        name="flash-outline"
                        size={13}
                        color="#f97316"
                      />
                    </View>
                    <Text className="text-sm font-semibold text-slate-700">
                      {label}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={14} color="#cbd5e1" />
                </Pressable>
              ))}
            </View>

            {/* Primary CTA */}
            <Pressable
              onPress={() => startWorkout()}
              className="w-full bg-orange-500 rounded-2xl py-4 items-center shadow-sm flex-row justify-center gap-x-2"
            >
              <Ionicons name="play-circle-outline" size={20} color="#fff" />
              <Text className="text-base font-black text-white">
                Start Workout
              </Text>
            </Pressable>
          </View>

          {/* Stat teasers */}
          <View className="flex-row gap-x-3 mt-3">
            {[
              {
                label: "sessions",
                value: "3",
                sub: "This Week",
                icon: "calendar-outline",
              },
              {
                label: "lbs lifted",
                value: "12.4k",
                sub: "Total Volume",
                icon: "trending-up-outline",
              },
            ].map((stat) => (
              <View
                key={stat.sub}
                className="flex-1 bg-white rounded-[24px] border border-slate-100 shadow-sm p-4"
              >
                <View className="w-8 h-8 rounded-xl bg-orange-50 items-center justify-center mb-3">
                  <Ionicons name={stat.icon as any} size={16} color="#f97316" />
                </View>
                <Text className="text-xl font-black text-slate-800">
                  {stat.value}
                </Text>
                <Text className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* ══════════════════════════════════════════════════════════
          ACTIVE / REST
      ══════════════════════════════════════════════════════════ */}
      {(screen === "active" || screen === "rest") && (
        <>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 8,
              paddingBottom: 160,
            }}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            scrollEventThrottle={16}
          >
            <WorkoutHeader
              currentDate={currentDate}
              workoutType={workoutType}
              onPrev={goPrevDay}
              onNext={goNextDay}
              onTypeChange={() => setShowTypePicker(true)}
            />

            {/* Active session banner */}
            <View className="bg-orange-500 rounded-[24px] p-4 mb-3 flex-row items-center justify-between shadow-sm">
              <View className="flex-row items-center gap-x-3">
                <View className="w-8 h-8 rounded-xl bg-white/20 items-center justify-center">
                  <Ionicons name="timer-outline" size={16} color="#fff" />
                </View>
                <View>
                  <Text className="text-[10px] font-bold text-orange-100 uppercase tracking-wider">
                    Active Session
                  </Text>
                  <Text className="text-base font-black text-white">
                    {fmtTime(elapsed)}
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-[10px] font-bold text-orange-100 uppercase tracking-wider">
                  Sets Done
                </Text>
                <Text className="text-base font-black text-white">
                  {totalSets}
                </Text>
              </View>
            </View>

            {/* Rest timer */}
            {screen === "rest" && (
              <RestTimer
                remaining={restRemaining}
                total={DEFAULT_REST}
                onSkip={stopRestTimer}
                onNextSet={stopRestTimer}
              />
            )}

            {/* Empty exercise placeholder */}
            {exercises.length === 0 && (
              <View className="bg-white rounded-[28px] border border-dashed border-slate-200 p-8 items-center mb-3">
                <Ionicons name="add-circle-outline" size={32} color="#cbd5e1" />
                <Text className="text-sm font-semibold text-slate-400 mt-3 text-center">
                  Tap + to add your first exercise
                </Text>
              </View>
            )}

            {/* Exercise cards */}
            {exercises.map((ex) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                onSetWeightChange={(setId, val) =>
                  updateSet(ex.id, setId, "weight", val)
                }
                onSetRepsChange={(setId, val) =>
                  updateSet(ex.id, setId, "reps", val)
                }
                onCompleteSet={(setId) => completeSet(ex.id, setId)}
                onAddSet={() => addSet(ex.id)}
                onToggleFavorite={() => toggleFavorite(ex.id)}
                onNotesChange={(val) => updateNotes(ex.id, val)}
              />
            ))}
          </ScrollView>

          {/* Bottom action bar */}
          <View
            className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 pt-3 pb-8"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: -4 },
              elevation: 8,
            }}
          >
            <View className="flex-row gap-x-3">
              {/* Add exercise */}
              <Pressable
                onPress={() => setShowAddExercise(true)}
                className="w-12 h-12 rounded-2xl bg-slate-100 items-center justify-center border border-slate-200"
              >
                <Ionicons name="add" size={22} color="#475569" />
              </Pressable>

              {/* Finish workout */}
              <Pressable
                onPress={finishWorkout}
                className="flex-1 bg-orange-500 rounded-2xl items-center justify-center flex-row gap-x-2 shadow-sm"
                style={{ height: 48 }}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color="#fff"
                />
                <Text className="text-sm font-black text-white">
                  Finish Workout
                </Text>
              </Pressable>
            </View>
          </View>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════
          SUMMARY
      ══════════════════════════════════════════════════════════ */}
      {screen === "summary" && (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 60,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header row */}
          <View className="flex-row items-center justify-between mb-4">
            <Pressable
              onPress={resetWorkout}
              className="w-9 h-9 rounded-xl bg-white border border-slate-100 items-center justify-center shadow-sm"
            >
              <Ionicons name="close" size={16} color="#475569" />
            </Pressable>
            <Text className="text-base font-black text-slate-800">
              Workout Summary
            </Text>
            <View className="w-9" />
          </View>

          {/* Trophy card */}
          <View className="bg-orange-500 rounded-[32px] p-6 mb-3 items-center shadow-sm">
            <View className="w-16 h-16 rounded-[20px] bg-white/20 items-center justify-center mb-4">
              <Ionicons name="trophy-outline" size={30} color="#fff" />
            </View>
            <Text className="text-2xl font-black text-white mb-1">
              Workout Complete!
            </Text>
            <Text className="text-sm text-orange-100 font-medium">
              {workoutType} ·{" "}
              {currentDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>

          {/* Stat cards */}
          <View className="flex-row gap-x-3 mb-3">
            {[
              {
                label: "Duration",
                value: fmtTime(elapsed),
                icon: "timer-outline",
              },
              {
                label: "Total Volume",
                value:
                  totalVolume >= 1000
                    ? `${(totalVolume / 1000).toFixed(1)}k lbs`
                    : `${totalVolume} lbs`,
                icon: "trending-up-outline",
              },
              {
                label: "Sets Done",
                value: `${totalSets}`,
                icon: "checkmark-circle-outline",
              },
            ].map((stat) => (
              <View
                key={stat.label}
                className="flex-1 bg-white rounded-[20px] border border-slate-100 shadow-sm p-3 items-center"
              >
                <View className="w-8 h-8 rounded-xl bg-orange-50 items-center justify-center mb-2">
                  <Ionicons name={stat.icon as any} size={15} color="#f97316" />
                </View>
                <Text className="text-base font-black text-slate-800">
                  {stat.value}
                </Text>
                <Text className="text-[9px] font-semibold text-slate-400 text-center uppercase tracking-wider mt-0.5">
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Exercise breakdown */}
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
            Exercises
          </Text>

          {completedExercises.length === 0 ? (
            <View className="bg-white rounded-[24px] border border-slate-100 p-6 items-center">
              <Text className="text-sm text-slate-400 font-medium">
                No sets completed
              </Text>
            </View>
          ) : (
            completedExercises.map((ex) => (
              <SummaryExerciseCard key={ex.id} exercise={ex} />
            ))
          )}

          {/* Done / back home */}
          <Pressable
            onPress={resetWorkout}
            className="mt-2 bg-slate-800 rounded-2xl py-4 items-center flex-row justify-center gap-x-2"
          >
            <Ionicons name="home-outline" size={16} color="#fff" />
            <Text className="text-sm font-black text-white">Done</Text>
          </Pressable>
        </ScrollView>
      )}

      {/* ══════════════════════════════════════════════════════════
          MODALS — always mounted, hidden via visible prop
      ══════════════════════════════════════════════════════════ */}
      <AddExerciseModal
        visible={showAddExercise}
        onClose={() => setShowAddExercise(false)}
        onAdd={addExercise}
      />

      <WorkoutTypePicker
        visible={showTypePicker}
        current={workoutType}
        onClose={() => setShowTypePicker(false)}
        onSelect={setWorkoutType}
      />
    </SafeAreaView>
  );
}
