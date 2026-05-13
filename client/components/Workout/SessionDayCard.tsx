import { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import type { WorkoutSession } from "@/types/workout";

const CATEGORY_COLORS: Record<string, string> = {
  push: "#f97316",
  pull: "#3b82f6",
  legs: "#8b5cf6",
  full_body: "#10b981",
};

const MUSCLE_COLORS: Record<string, string> = {
  chest: "#f97316",
  back: "#3b82f6",
  legs: "#8b5cf6",
  shoulders: "#10b981",
  biceps: "#f59e0b",
  triceps: "#ef4444",
  core: "#06b6d4",
};

const formatDuration = (seconds: number | null) => {
  if (!seconds) return "In progress";
  const m = Math.floor(seconds / 60);
  const h = Math.floor(m / 60);
  return h > 0 ? `${h}h ${m % 60}m` : `${m}m`;
};

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

interface Props {
  session: WorkoutSession;
  isToday: boolean;
}

export default function SessionDayCard({ session, isToday }: Props) {
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);

  const color = CATEGORY_COLORS[session.category] ?? "#64748b";
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
      {/* ── Dark header ── */}
      <View className="bg-slate-900 px-5 py-5">
        {/* Top row */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2">
            <View
              className="px-2.5 py-0.5 rounded-full border"
              style={{
                backgroundColor: color + "25",
                borderColor: color + "50",
              }}
            >
              <Text
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color }}
              >
                {session.category.replace("_", " ")}
              </Text>
            </View>

            {!session.is_finished ? (
              <View className="flex-row items-center gap-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-2 py-0.5">
                <View className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <Text className="text-[10px] font-bold text-emerald-400">
                  ACTIVE
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center gap-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-2 py-0.5">
                <Feather name="check-circle" size={10} color="#10b981" />
                <Text className="text-[10px] font-bold text-emerald-400">
                  FINISHED
                </Text>
              </View>
            )}
          </View>

          {/* Time range */}
          <View className="flex-row items-center gap-1">
            <Text className="text-[11px] text-slate-500">
              {formatTime(session.start_time)}
            </Text>
            {session.end_time && (
              <View className="flex-row items-center gap-1">
                <Feather name="arrow-right" size={10} color="#475569" />
                <Text className="text-[11px] text-slate-500">
                  {formatTime(session.end_time)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Notes */}
        {session.notes ? (
          <View className="flex-row items-center gap-2 mb-3">
            <Feather name="message-circle" size={11} color="#64748b" />
            <Text
              className="text-xs text-slate-400 italic flex-1"
              numberOfLines={1}
            >
              "{session.notes}"
            </Text>
          </View>
        ) : null}

        {/* Main stats */}
        <View className="flex-row gap-2 mb-2">
          <View className="flex-1 bg-slate-800 rounded-[12px] px-3 py-2.5 items-center">
            <Text className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">
              Sets
            </Text>
            <Text className="text-base font-black text-white">
              {completedSets}
              <Text className="text-xs text-slate-500">/{totalSets}</Text>
            </Text>
          </View>
          <View className="flex-1 bg-slate-800 rounded-[12px] px-3 py-2.5 items-center">
            <Text className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">
              Volume
            </Text>
            <Text className="text-base font-black text-white">
              {session.total_volume.toLocaleString()}
              <Text className="text-xs text-slate-500"> kg</Text>
            </Text>
          </View>
          <View className="flex-1 bg-slate-800 rounded-[12px] px-3 py-2.5 items-center">
            <Text className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">
              Duration
            </Text>
            <Text className="text-base font-black text-white">
              {formatDuration(session.duration_seconds)}
            </Text>
          </View>
          <View className="flex-1 bg-slate-800 rounded-[12px] px-3 py-2.5 items-center">
            <Text className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">
              Reps
            </Text>
            <Text className="text-base font-black text-white">
              {session.total_reps}
            </Text>
          </View>
        </View>

        {/* Energy + mood */}
        <View className="flex-row gap-2">
          <View className="flex-1 bg-slate-800 rounded-[12px] px-3 py-2 flex-row items-center gap-2">
            <Feather name="zap" size={12} color="#f97316" />
            <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Energy
            </Text>
            <Text className="text-xs font-black text-white ml-auto">
              {session.energy_level}/10
            </Text>
          </View>
          <View className="flex-1 bg-slate-800 rounded-[12px] px-3 py-2 flex-row items-center gap-2">
            <Feather name="smile" size={12} color="#8b5cf6" />
            <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Mood
            </Text>
            <Text className="text-xs font-black text-white ml-auto">
              {session.mood_rating}/10
            </Text>
          </View>
        </View>
      </View>

      {/* ── Exercise breakdown ── */}
      <View className="px-4 py-3 gap-2.5">
        <View className="flex-row items-center gap-1.5 mb-1">
          <Feather name="layers" size={11} color="#94a3b8" />
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Exercises ({session.workout_exercises.length})
          </Text>
        </View>

        {session.workout_exercises.map((we) => {
          const muscleColor =
            MUSCLE_COLORS[we.exercise.muscle_group] ?? "#64748b";
          const weSets = we.sets.filter((s) => s.completed);
          const isExpanded = expandedExercise === we.id;
          const bestSet = we.best_set;

          return (
            <View
              key={we.id}
              className="bg-slate-50 border border-slate-100 rounded-[16px] overflow-hidden"
            >
              {/* Exercise row */}
              <Pressable
                onPress={() => setExpandedExercise(isExpanded ? null : we.id)}
                className="flex-row items-center gap-3 px-3 py-3"
              >
                <View
                  className="w-8 h-8 rounded-[10px] items-center justify-center"
                  style={{
                    backgroundColor: muscleColor + "20",
                    borderWidth: 1,
                    borderColor: muscleColor + "30",
                  }}
                >
                  <Feather name="zap" size={13} color={muscleColor} />
                </View>

                <View className="flex-1">
                  <Text
                    className="text-xs font-black text-slate-800 mb-0.5"
                    numberOfLines={1}
                  >
                    {we.exercise.name}
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-[10px] text-slate-400">
                      {weSets.length} sets
                    </Text>
                    <Text className="text-[10px] text-slate-300">·</Text>
                    <Text className="text-[10px] text-slate-400">
                      {we.total_volume.toLocaleString()} kg
                    </Text>
                    {bestSet && (
                      <View className="flex-row items-center gap-1">
                        <Text className="text-[10px] text-slate-300">·</Text>
                        <Text className="text-[10px] text-slate-400">
                          Best {bestSet.weight}kg×{bestSet.reps}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View className="flex-row items-center gap-1.5">
                  {we.is_favorite && (
                    <Feather name="star" size={12} color="#f97316" />
                  )}
                  <Feather
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={14}
                    color="#94a3b8"
                  />
                </View>
              </Pressable>

              {/* Expanded set details */}
              {isExpanded && (
                <View className="border-t border-slate-100 px-3 pb-3 pt-2 gap-1.5">
                  {/* Set column headers */}
                  <View className="flex-row items-center px-2 mb-1">
                    <Text className="w-8 text-[9px] font-bold text-slate-400 uppercase">
                      Set
                    </Text>
                    <Text className="flex-1 text-[9px] font-bold text-slate-400 uppercase text-center">
                      Kg
                    </Text>
                    <Text className="flex-1 text-[9px] font-bold text-slate-400 uppercase text-center">
                      Reps
                    </Text>
                    <Text className="flex-1 text-[9px] font-bold text-slate-400 uppercase text-center">
                      RPE
                    </Text>
                    <Text className="flex-1 text-[9px] font-bold text-slate-400 uppercase text-center">
                      Rest
                    </Text>
                  </View>

                  {we.sets.map((s) => (
                    <View
                      key={s.id}
                      className="flex-row items-center bg-white border border-slate-100 rounded-[10px] px-2 py-2"
                    >
                      {/* Set number */}
                      <View className="w-8 items-center">
                        <View className="w-5 h-5 rounded-full bg-slate-100 items-center justify-center">
                          <Text className="text-[9px] font-black text-slate-500">
                            {s.set_number}
                          </Text>
                        </View>
                      </View>

                      <Text className="flex-1 text-xs font-black text-slate-700 text-center">
                        {s.weight}
                      </Text>
                      <Text className="flex-1 text-xs font-black text-slate-700 text-center">
                        {s.reps}
                      </Text>
                      <Text className="flex-1 text-xs font-bold text-slate-400 text-center">
                        {s.rpe ?? "—"}
                      </Text>
                      <Text className="flex-1 text-xs font-bold text-slate-400 text-center">
                        {s.rest_taken ?? s.rest_target}s
                      </Text>

                      {/* Badges */}
                      <View className="flex-row gap-1 ml-1">
                        {s.is_pr && (
                          <View className="bg-yellow-100 rounded-full px-1.5 py-0.5">
                            <Text className="text-[8px] font-black text-yellow-600">
                              PR
                            </Text>
                          </View>
                        )}
                        {s.is_warmup && (
                          <View className="bg-blue-100 rounded-full px-1.5 py-0.5">
                            <Text className="text-[8px] font-bold text-blue-500">
                              W
                            </Text>
                          </View>
                        )}
                        {s.is_dropset && (
                          <View className="bg-purple-100 rounded-full px-1.5 py-0.5">
                            <Text className="text-[8px] font-bold text-purple-500">
                              D
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ))}

                  {/* Exercise notes */}
                  {we.notes ? (
                    <View className="flex-row items-center gap-1.5 mt-1 px-1">
                      <Feather name="file-text" size={10} color="#94a3b8" />
                      <Text className="text-[10px] text-slate-400 italic flex-1">
                        {we.notes}
                      </Text>
                    </View>
                  ) : null}
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* ── Resume button ── */}
      {isToday && !session.is_finished && (
        <View className="px-4 pb-4">
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
