// components/WorkoutCard.tsx
import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MotiView } from "moti";

interface WorkoutSummary {
  date: string;
  total_workouts: number;
  total_duration_seconds: number;
  total_duration_minutes: number;
  total_sets: number;
  total_reps: number;
  total_volume: number;
  calories_burned: number;
  average_energy: number;
  average_mood: number;
  pr_count: number;
}

interface WorkoutCardProps {
  data: WorkoutSummary;
}

function formatDuration(minutes: number): string {
  const m = Math.floor(minutes);
  const s = Math.round((minutes - m) * 60);
  if (m === 0) return `${s}s`;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function formatVolume(vol: number): string {
  if (vol >= 1000) return `${(vol / 1000).toFixed(1)}k`;
  return vol.toString();
}

const MOOD_LABELS: Record<number, string> = {
  1: "Awful",
  2: "Bad",
  3: "Poor",
  4: "Meh",
  5: "Okay",
  6: "Fine",
  7: "Good",
  8: "Great",
  9: "Amazing",
  10: "Perfect",
};

const ENERGY_COLOR = (val: number) =>
  val >= 8 ? "#34d399" : val >= 5 ? "#facc15" : "#fb923c";

const MOOD_COLOR = (val: number) =>
  val >= 8 ? "#a78bfa" : val >= 5 ? "#38bdf8" : "#f472b6";

export function WorkoutCard({ data }: WorkoutCardProps) {
  const durationProgress = Math.min(
    (data.total_duration_minutes / 60) * 100,
    100,
  );
  const volumeProgress = Math.min((data.total_volume / 5000) * 100, 100);
  const energyProgress = (data.average_energy / 10) * 100;
  const moodProgress = (data.average_mood / 10) * 100;
  const calProgress = Math.min((data.calories_burned / 300) * 100, 100);

  const subStats = [
    {
      label: "Sets",
      value: data.total_sets.toString(),
      unit: "sets done",
      progress: Math.min((data.total_sets / 20) * 100, 100),
      color: "#38bdf8",
    },
    {
      label: "Reps",
      value: data.total_reps.toString(),
      unit: "total reps",
      progress: Math.min((data.total_reps / 100) * 100, 100),
      color: "#a78bfa",
    },
    {
      label: "Volume",
      value: formatVolume(data.total_volume),
      unit: "kg lifted",
      progress: volumeProgress,
      color: "#34d399",
    },
    {
      label: "Calories",
      value: data.calories_burned.toFixed(0),
      unit: "kcal burned",
      progress: calProgress,
      color: "#fb923c",
    },
  ];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 24, scale: 0.97 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
      className="bg-[#0f172a] rounded-[36px] p-6 mb-6 border border-slate-800/60"
      style={{
        shadowColor: "#0f172a",
        shadowOpacity: 0.6,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 },
        elevation: 12,
      }}
    >
      {/* ── Top row: title + PR badge ── */}
      <View className="flex-row justify-between items-start mb-5">
        <View>
          <MotiView
            from={{ opacity: 0, translateX: -12 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: "timing", duration: 350, delay: 100 }}
          >
            <Text className="text-sky-400 font-bold text-xs uppercase mb-1.5 tracking-widest">
              Workout Summary
            </Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 16,
              delay: 180,
            }}
          >
            <View className="flex-row items-baseline gap-1.5">
              <Text className="text-5xl font-black text-white tracking-tighter">
                {formatDuration(data.total_duration_minutes)}
              </Text>
              <Text className="text-sm font-semibold text-slate-600">
                duration
              </Text>
            </View>
          </MotiView>
        </View>

        {/* Icon + PR */}
        <MotiView
          from={{ opacity: 0, scale: 0.4, rotate: "-30deg" }}
          animate={{ opacity: 1, scale: 1, rotate: "0deg" }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 14,
            delay: 200,
          }}
          className="items-end gap-2"
        >
          <View className="bg-slate-800 h-11 w-11 rounded-full items-center justify-center border border-slate-700">
            <Feather name="activity" size={20} color="#38bdf8" />
          </View>
          {data.pr_count > 0 && (
            <View className="flex-row items-center gap-1 bg-yellow-400/10 border border-yellow-400/30 px-2 py-0.5 rounded-full">
              <Feather name="award" size={10} color="#facc15" />
              <Text className="text-[10px] font-black text-yellow-400">
                {data.pr_count} PR
              </Text>
            </View>
          )}
        </MotiView>
      </View>

      {/* ── Duration progress bar ── */}
      <View className="h-2 bg-slate-800 rounded-full overflow-hidden mb-1.5">
        <MotiView
          from={{ width: "0%" as `${number}%` }}
          animate={{ width: `${durationProgress}%` as `${number}%` }}
          transition={{ type: "timing", duration: 900, delay: 300 }}
          style={{
            height: "100%",
            backgroundColor: "#38bdf8",
            borderRadius: 99,
          }}
        />
      </View>

      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "timing", duration: 300, delay: 500 }}
      >
        <Text className="text-slate-600 text-xs font-medium text-center mb-5">
          <Text className="text-white font-bold">
            {data.total_workouts}{" "}
            {data.total_workouts === 1 ? "workout" : "workouts"}
          </Text>{" "}
          logged today
        </Text>
      </MotiView>

      {/* ── Divider ── */}
      <MotiView
        from={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ type: "timing", duration: 400, delay: 350 }}
        style={{ transformOrigin: "left" }}
        className="h-px bg-slate-800 mb-5"
      />

      {/* ── Sub-stats grid ── */}
      <View className="flex-row gap-3 mb-5">
        {subStats.map((stat, index) => (
          <MotiView
            key={stat.label}
            from={{ opacity: 0, translateY: 14 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 16,
              delay: 420 + index * 80,
            }}
            className="flex-1"
          >
            <Text className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">
              {stat.label}
            </Text>

            <MotiView
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 14,
                delay: 500 + index * 80,
              }}
            >
              <Text
                className="text-xl font-black tracking-tight"
                style={{ color: stat.color }}
              >
                {stat.value}
              </Text>
            </MotiView>

            <Text className="text-[10px] font-medium text-slate-600 mb-1.5">
              {stat.unit}
            </Text>

            <View className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <MotiView
                from={{ width: "0%" as `${number}%` }}
                animate={{ width: `${stat.progress}%` as `${number}%` }}
                transition={{
                  type: "timing",
                  duration: 700,
                  delay: 560 + index * 80,
                }}
                style={{
                  height: "100%",
                  backgroundColor: stat.color,
                  borderRadius: 99,
                }}
              />
            </View>
          </MotiView>
        ))}
      </View>

      {/* ── Divider ── */}
      <View className="h-px bg-slate-800 mb-4" />

      {/* ── Energy + Mood row ── */}
      <View className="flex-row gap-3">
        {[
          {
            label: "Energy",
            value: data.average_energy.toFixed(1),
            max: 10,
            progress: energyProgress,
            color: ENERGY_COLOR(data.average_energy),
            icon: "zap",
            sub: `/ 10`,
          },
          {
            label: "Mood",
            value:
              MOOD_LABELS[Math.round(data.average_mood)] ??
              data.average_mood.toFixed(1),
            max: 10,
            progress: moodProgress,
            color: MOOD_COLOR(data.average_mood),
            icon: "smile",
            sub: `${data.average_mood.toFixed(1)} / 10`,
          },
        ].map((item, index) => (
          <MotiView
            key={item.label}
            from={{ opacity: 0, translateY: 14 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 16,
              delay: 700 + index * 80,
            }}
            className="flex-1 rounded-2xl bg-slate-800/50 border border-slate-700/40 p-3"
          >
            <View className="flex-row items-center gap-1.5 mb-2">
              <Feather name={item.icon as any} size={11} color={item.color} />
              <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {item.label}
              </Text>
            </View>

            <Text
              className="text-2xl font-black tracking-tight mb-0.5"
              style={{ color: item.color }}
            >
              {item.value}
            </Text>
            <Text className="text-[10px] text-slate-600 font-medium mb-2">
              {item.sub}
            </Text>

            <View className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <MotiView
                from={{ width: "0%" as `${number}%` }}
                animate={{ width: `${item.progress}%` as `${number}%` }}
                transition={{
                  type: "timing",
                  duration: 800,
                  delay: 780 + index * 80,
                }}
                style={{
                  height: "100%",
                  backgroundColor: item.color,
                  borderRadius: 99,
                }}
              />
            </View>
          </MotiView>
        ))}
      </View>
    </MotiView>
  );
}
