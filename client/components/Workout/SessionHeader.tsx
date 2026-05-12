import { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { WorkoutSession, WorkoutTemplate } from "@/types/workout";
import { getCategoryMeta } from "@/components/Workout/StartSessionCardContainer/helpers";
import { fetchWorkoutTemplateById } from "@/api/workout";

interface Props {
  session: WorkoutSession;
  onBack: () => void;
}

export default function SessionHeader({ session, onBack }: Props) {
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
    if (!seconds) return "In progress";
    const m = Math.floor(seconds / 60);
    const h = Math.floor(m / 60);
    return h > 0 ? `${h}h ${m % 60}m` : `${m}m`;
  };

  const totalSets = session.workout_exercises.reduce(
    (acc, we) => acc + we.sets.length,
    0,
  );

  return (
    <View className="bg-slate-900 px-5 pt-5 pb-6 mb-4">
      {/* ── Top row ── */}
      <View className="flex-row items-center justify-between mb-5">
        <Pressable
          onPress={onBack}
          className="w-9 h-9 rounded-[12px] bg-slate-800 border border-slate-700 items-center justify-center"
        >
          <Feather name="chevron-left" size={18} color="#fff" />
        </Pressable>

        <View className="flex-row items-center gap-1.5">
          <Feather name="activity" size={11} color="#f97316" />
          <Text className="text-[10px] font-bold tracking-[2px] uppercase text-orange-400">
            Active Session
          </Text>
        </View>

        <View className="flex-row items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-2.5 py-1">
          <View className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <Text className="text-[10px] font-bold text-emerald-400">LIVE</Text>
        </View>
      </View>

      {/* ── Title + template name ── */}
      <Text
        className="text-2xl font-black text-white mb-1"
        style={{ letterSpacing: -0.5 }}
      >
        {template?.name ?? `${meta.label} Day`}
      </Text>

      {template?.description ? (
        <Text className="text-xs text-slate-500 mb-3" numberOfLines={1}>
          {template.description}
        </Text>
      ) : null}

      {/* ── Meta row ── */}
      <View className="flex-row items-center gap-2 flex-wrap mb-4">
        <View
          className="px-2.5 py-0.5 rounded-full border"
          style={{
            backgroundColor: meta.color + "25",
            borderColor: meta.color + "50",
          }}
        >
          <Text
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: meta.color }}
          >
            {meta.label}
          </Text>
        </View>

        <View className="flex-row items-center gap-1">
          <Feather name="calendar" size={11} color="#94a3b8" />
          <Text className="text-xs text-slate-400">
            {formatDate(session.date)}
          </Text>
        </View>

        <View className="flex-row items-center gap-1">
          <Feather name="clock" size={11} color="#94a3b8" />
          <Text className="text-xs text-slate-400">
            {formatTime(session.start_time)}
          </Text>
        </View>

        {/* Estimated duration from template */}
        {template?.estimated_duration ? (
          <View className="flex-row items-center gap-1 bg-slate-800 rounded-full px-2 py-0.5">
            <Feather name="flag" size={10} color="#64748b" />
            <Text className="text-[10px] text-slate-400">
              ~{template.estimated_duration}m goal
            </Text>
          </View>
        ) : null}

        {session.notes ? (
          <Text className="text-xs text-slate-500 flex-1" numberOfLines={1}>
            · {session.notes}
          </Text>
        ) : null}
      </View>

      {/* ── Divider ── */}
      <View className="h-px bg-slate-800 mb-4" />

      {/* ── Stats grid ── */}
      <View className="flex-row gap-2 mb-3">
        {[
          {
            label: "Volume",
            value: session.total_volume.toLocaleString(),
            unit: "kg",
          },
          {
            label: "Sets",
            value: `${session.total_sets_completed}`,
            unit: `/${totalSets}`,
          },
          { label: "Reps", value: `${session.total_reps}`, unit: "" },
          {
            label: "Duration",
            value: formatDuration(session.duration_seconds),
            unit: "",
          },
        ].map((s) => (
          <View
            key={s.label}
            className="flex-1 bg-slate-800 rounded-[12px] px-2 py-2.5 items-center"
          >
            <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
              {s.label}
            </Text>
            <Text className="text-sm font-black text-white">
              {s.value}
              {s.unit ? (
                <Text className="text-xs text-slate-500">{s.unit}</Text>
              ) : null}
            </Text>
          </View>
        ))}
      </View>

      {/* ── Vitals row ── */}
      <View className="flex-row gap-2">
        {/* Energy */}
        <View className="flex-1 bg-slate-800 rounded-[12px] px-3 py-2.5">
          <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
            Energy
          </Text>
          <Text className="text-sm font-black text-white mb-1">
            {session.energy_level}
            <Text className="text-xs text-slate-500"> /10</Text>
          </Text>
          <View className="h-1 bg-slate-900 rounded-full overflow-hidden">
            <View
              className="h-full bg-orange-500 rounded-full"
              style={{ width: `${session.energy_level * 10}%` }}
            />
          </View>
        </View>

        {/* Mood */}
        <View className="flex-1 bg-slate-800 rounded-[12px] px-3 py-2.5">
          <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
            Mood
          </Text>
          <Text className="text-sm font-black text-white mb-1">
            {session.mood_rating}
            <Text className="text-xs text-slate-500"> /10</Text>
          </Text>
          <View className="h-1 bg-slate-900 rounded-full overflow-hidden">
            <View
              className="h-full bg-violet-500 rounded-full"
              style={{ width: `${session.mood_rating * 10}%` }}
            />
          </View>
        </View>

        {/* Bodyweight */}
        <View className="flex-1 bg-slate-800 rounded-[12px] px-3 py-2.5">
          <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
            Bodyweight
          </Text>
          <Text className="text-sm font-black text-white">
            {session.bodyweight}
            <Text className="text-xs text-slate-500">
              {" "}
              {session.weight_unit}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
