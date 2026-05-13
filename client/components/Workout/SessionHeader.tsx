import { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import {
  ChevronLeft,
  Calendar,
  Clock,
  Weight,
  Layers,
  Repeat,
  Timer,
  Zap,
  Smile,
  User,
} from "lucide-react-native"; // Using Lucide for a consistent look
import type { WorkoutSession, WorkoutTemplate } from "@/types/workout";
import { getCategoryMeta } from "@/components/Workout/StartSessionCardContainer/helpers";
import { fetchWorkoutTemplateById } from "@/api/workout";
import { SessionHeaderProps } from "@/types/workout";

export default function SessionHeader({
  weightUnit,
  session,
  onBack,
}: SessionHeaderProps) {
  const meta = getCategoryMeta(session.category);
  const [template, setTemplate] = useState<WorkoutTemplate | null>(null);

  useEffect(() => {
    if (!session.template) return;
    fetchWorkoutTemplateById(session.template)
      .then(setTemplate)
      .catch(console.error);
  }, [session.template]);

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "Live";
    const m = Math.floor(seconds / 60);
    const h = Math.floor(m / 60);
    return h > 0 ? `${h}h ${m % 60}m` : `${m}m`;
  };

  const totalSets = session.workout_exercises.reduce(
    (acc, we) => acc + we.sets.length,
    0,
  );

  return (
    <View className="bg-slate-900 px-4 pt-4 pb-4 mb-4 border-b border-slate-800">
      {/* ── Top row ── */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={onBack}
            className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 items-center justify-center"
          >
            <ChevronLeft size={16} color="#fff" />
          </Pressable>
          <View className="flex-1">
            <Text className="text-lg font-black text-white leading-tight">
              {template?.name ?? `${meta.label} Day`}
            </Text>

            {/* RESTORED: Notes & Goal (Small) */}
            <View className="flex-row items-center gap-2 mt-0.5">
              <Text className="text-[10px] font-bold text-slate-500 uppercase">
                {formatDate(session.date)}
              </Text>

              {template?.estimated_duration && (
                <Text className="text-[10px] text-orange-500/80 font-bold uppercase">
                  • {template.estimated_duration}m Goal
                </Text>
              )}

              {session.notes && (
                <Text
                  className="text-[10px] text-slate-500 italic flex-1"
                  numberOfLines={1}
                >
                  • {session.notes}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* ── Compact Stats Row ── */}
      <View className="flex-row items-center justify-between bg-slate-800/50 rounded-xl py-2.5 px-3 mb-3 border border-slate-800">
        <View className="items-center">
          <Weight size={12} color="#3b82f6" />
          <Text className="text-[11px] font-black text-white mt-0.5">
            {session.total_volume.toLocaleString()}
            <Text className="text-[8px] text-slate-500"> {weightUnit}</Text>
          </Text>
        </View>
        <View className="w-[1px] h-4 bg-slate-700" />
        <View className="items-center">
          <Layers size={12} color="#f59e0b" />
          <Text className="text-[11px] font-black text-white mt-0.5">
            {session.total_sets_completed}
            <Text className="text-[8px] text-slate-500">/{totalSets}</Text>
          </Text>
        </View>
        <View className="w-[1px] h-4 bg-slate-700" />
        <View className="items-center">
          <Repeat size={12} color="#10b981" />
          <Text className="text-[11px] font-black text-white mt-0.5">
            {session.total_reps}
          </Text>
        </View>
        <View className="w-[1px] h-4 bg-slate-700" />
        <View className="items-center">
          <Timer size={12} color="#6366f1" />
          <Text className="text-[11px] font-black text-white mt-0.5">
            {formatDuration(session.duration_seconds)}
          </Text>
        </View>
      </View>

      {/* ── Vitals Footer Row ── */}
      <View className="flex-row items-center gap-4 px-1">
        <View className="flex-1 flex-row items-center gap-2">
          <Zap size={10} color="#f97316" fill="#f97316" />
          <View className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
            <View
              className="h-full bg-orange-500"
              style={{ width: `${session.energy_level * 10}%` }}
            />
          </View>
        </View>

        <View className="flex-1 flex-row items-center gap-2">
          <Smile size={10} color="#8b5cf6" fill="#8b5cf6" />
          <View className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
            <View
              className="h-full bg-violet-500"
              style={{ width: `${session.mood_rating * 10}%` }}
            />
          </View>
        </View>

        <View className="flex-row items-center gap-1.5">
          <User size={10} color="#94a3b8" />
          <Text className="text-[10px] font-bold text-slate-400">
            {session.bodyweight}
            <Text className="text-[8px] text-slate-600">
              {" "}
              {session.weight_unit}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
