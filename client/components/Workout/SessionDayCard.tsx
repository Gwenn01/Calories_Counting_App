import { View } from "react-native";
import { Pressable, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import type { WorkoutSession } from "@/types/workout";
import SessionDayHeader from "@/components/Workout/SessionDayCardContainer/SessionDayHeader";
import ExerciseBreakdown from "@/components/Workout/SessionDayCardContainer/ExerciseBreakdown";

interface Props {
  session: WorkoutSession;
  isToday: boolean;
}

export default function SessionDayCard({ session, isToday }: Props) {
  const completedSets = session.workout_exercises.reduce(
    (acc, we) => acc + we.sets.filter((s) => s.completed).length,
    0,
  );
  const totalSets = session.workout_exercises.reduce(
    (acc, we) => acc + we.sets.length,
    0,
  );

  return (
    <View className="bg-white rounded-[24px] border border-slate-100 overflow-hidden mt-4">
      <SessionDayHeader
        session={session}
        completedSets={completedSets}
        totalSets={totalSets}
      />

      <ExerciseBreakdown
        weightUnit={session.weight_unit}
        exercises={session.workout_exercises}
      />

      {isToday && !session.is_finished && (
        <View className="px-4 pb-4 mt-3">
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/workout/session/[id]",
                params: { id: session.id },
              })
            }
            className="bg-slate-900 rounded-[14px] py-3.5 flex-row items-center justify-center gap-2"
          >
            <Feather name="play" size={15} color="#fff" />
            <Text className="text-sm font-black text-white uppercase tracking-wide">
              Resume Session
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
