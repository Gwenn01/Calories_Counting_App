import { useState, useCallback, useEffect, useRef } from "react";
import { View, ScrollView, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// components
import WorkoutHeader from "@/components/Workout/WorkoutHeader";
import ExerciseCard from "@/components/Workout/ExerciseCard";
import RestTimer from "@/components/Workout/RestTimer";
import SummaryExerciseCard from "@/components/Workout/Summaryexercisecard";
import AddExerciseModal from "@/components/Workout/Addexercisemodal ";
import WorkoutTypePicker from "@/components/Workout/WorkoutTypePicker";

// utils
import { newExercise, newSet, fmtTime } from "@/helpers/workout";
import { DEFAULT_REST } from "@/constants/workout";
import { WorkoutType, Exercise } from "@/types/workout";

type ScreenState = "empty" | "active" | "rest" | "summary";

export default function WorkoutScreen() {
  const [screen, setScreen] = useState<ScreenState>("empty");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workoutType, setWorkoutType] = useState<WorkoutType>("Push");
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const [showAddExercise, setShowAddExercise] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);

  // timer
  const [restRemaining, setRestRemaining] = useState(DEFAULT_REST);
  const timerRef = useRef<any>(null);

  // elapsed
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef<any>(null);

  // ─── DATE NAV ───
  const goPrevDay = () =>
    setCurrentDate((d) => new Date(d.getTime() - 86400000));
  const goNextDay = () =>
    setCurrentDate((d) => new Date(d.getTime() + 86400000));

  // ─── TIMER ───
  const startRestTimer = () => {
    setRestRemaining(DEFAULT_REST);
    setScreen("rest");

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setRestRemaining((r) => {
        if (r <= 1) {
          clearInterval(timerRef.current);
          setScreen("active");
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  };

  const stopRestTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setScreen("active");
  };

  // ─── ELAPSED ───
  useEffect(() => {
    if (screen === "active" || screen === "rest") {
      if (!elapsedRef.current) {
        elapsedRef.current = setInterval(() => {
          setElapsed((e) => e + 1);
        }, 1000);
      }
    } else {
      if (elapsedRef.current) clearInterval(elapsedRef.current);
      elapsedRef.current = null;
    }
  }, [screen]);

  // ─── ACTIONS ───
  const startWorkout = () => {
    setExercises([]);
    setElapsed(0);
    setScreen("active");
  };

  const finishWorkout = () => {
    clearInterval(timerRef.current);
    setScreen("summary");
  };

  const addExercise = (name: string) => {
    setExercises((prev) => [...prev, newExercise(name)]);
  };

  const addSet = (exId: string) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exId
          ? {
              ...ex,
              sets: [
                ...ex.sets,
                newSet(ex.sets.at(-1)?.weight, ex.sets.at(-1)?.reps),
              ],
            }
          : ex,
      ),
    );
  };

  const updateSet = (
    exId: string,
    setId: string,
    field: "weight" | "reps",
    value: string,
  ) => {
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
  };

  const completeSet = (exId: string, setId: string) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id !== exId
          ? ex
          : {
              ...ex,
              sets: ex.sets.map((s) =>
                s.id === setId ? { ...s, done: !s.done } : s,
              ),
            },
      ),
    );

    startRestTimer();
  };

  // ─── SUMMARY ───
  const totalSets = exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.done).length,
    0,
  );

  const totalVolume = exercises.reduce(
    (acc, ex) =>
      acc +
      ex.sets
        .filter((s) => s.done)
        .reduce(
          (a, s) => a + (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0),
          0,
        ),
    0,
  );

  // ─── UI ───
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* HEADER */}
      <WorkoutHeader
        currentDate={currentDate}
        workoutType={workoutType}
        onPrev={goPrevDay}
        onNext={goNextDay}
        onTypeChange={() => setShowTypePicker(true)}
      />

      {/* ACTIVE / REST */}
      {(screen === "active" || screen === "rest") && (
        <>
          <ScrollView className="px-4">
            {screen === "rest" && (
              <RestTimer
                remaining={restRemaining}
                total={DEFAULT_REST}
                onSkip={stopRestTimer}
                onNextSet={stopRestTimer}
              />
            )}

            {exercises.map((ex) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                onSetWeightChange={(id, val) =>
                  updateSet(ex.id, id, "weight", val)
                }
                onSetRepsChange={(id, val) => updateSet(ex.id, id, "reps", val)}
                onCompleteSet={(id) => completeSet(ex.id, id)}
                onAddSet={() => addSet(ex.id)}
                onToggleFavorite={() => {}}
                onNotesChange={() => {}}
              />
            ))}
          </ScrollView>

          {/* FOOTER */}
          <View className="p-4 flex-row gap-2">
            <Pressable
              onPress={() => setShowAddExercise(true)}
              className="bg-slate-200 p-4 rounded-xl"
            >
              <Ionicons name="add" size={20} />
            </Pressable>

            <Pressable
              onPress={finishWorkout}
              className="flex-1 bg-orange-500 p-4 rounded-xl items-center"
            >
              <Text className="text-white font-bold">Finish Workout</Text>
            </Pressable>
          </View>
        </>
      )}

      {/* EMPTY */}
      {screen === "empty" && (
        <View className="flex-1 items-center justify-center">
          <Pressable
            onPress={startWorkout}
            className="bg-orange-500 px-6 py-4 rounded-xl"
          >
            <Text className="text-white font-bold">Start Workout</Text>
          </Pressable>
        </View>
      )}

      {/* SUMMARY */}
      {screen === "summary" && (
        <ScrollView className="p-4">
          <Text className="text-xl font-bold mb-4">Workout Summary</Text>

          <Text>Sets: {totalSets}</Text>
          <Text>Volume: {(totalVolume / 1000).toFixed(1)}k</Text>

          {exercises.map((ex) => (
            <SummaryExerciseCard key={ex.id} exercise={ex} />
          ))}
        </ScrollView>
      )}

      {/* MODALS */}
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
