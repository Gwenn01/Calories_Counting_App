// components/SleepCard.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

const DELAY_OPTIONS = [
  { label: "Now", minutes: 0 },
  { label: "10 min", minutes: 10 },
  { label: "20 min", minutes: 20 },
  { label: "30 min", minutes: 30 },
];

interface SleepStat {
  label: string;
  value: string;
  progress: number;
}

interface SleepCardProps {
  lastNight?: {
    total: SleepStat;
    deep: SleepStat;
    rem: SleepStat;
  };
  bedtime?: string;
  wakeTime?: string;
  onSessionEnd?: (elapsedSeconds: number) => void;
}

export function SleepCard({
  lastNight = {
    total: { label: "Total", value: "7h 24m", progress: 77 },
    deep: { label: "Deep", value: "2h 10m", progress: 45 },
    rem: { label: "REM", value: "1h 48m", progress: 38 },
  },
  bedtime = "10:30 PM",
  wakeTime = "6:02 AM",
  onSessionEnd,
}: SleepCardProps) {
  const [selectedMin, setSelectedMin] = useState(0);
  const [sleeping, setSleeping] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [pending, setPending] = useState(false);

  const sleepTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      clearInterval(sleepTimer.current!);
      clearInterval(countdownTimer.current!);
    },
    [],
  );

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return [h, m, sec].map((x) => String(x).padStart(2, "0")).join(":");
  };

  const fmtCountdown = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const startSleep = () => {
    setPending(false);
    setSleeping(true);
    setElapsed(0);
    sleepTimer.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  };

  const handleSleep = () => {
    if (sleeping || pending) return;
    if (selectedMin === 0) {
      startSleep();
    } else {
      setPending(true);
      setCountdown(selectedMin * 60);
      countdownTimer.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(countdownTimer.current!);
            startSleep();
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
  };

  const handleWakeUp = () => {
    clearInterval(sleepTimer.current!);
    setSleeping(false);
    onSessionEnd?.(elapsed);
  };

  return (
    <View className="bg-[#0c1a2e] rounded-[36px] p-6 mb-6">
      {/* Header */}
      <View className="flex-row justify-between items-start mb-5">
        <View>
          <Text className="text-[#38bdf8] font-bold text-xs uppercase tracking-widest mb-1.5">
            Sleep Tracker
          </Text>
          <Text className="text-white font-black text-5xl tracking-tighter leading-tight">
            {fmt(elapsed)}
          </Text>
          <Text
            className="text-xs font-semibold mt-1"
            style={{ color: sleeping ? "#38bdf8" : "#2d5a8e" }}
          >
            {sleeping
              ? "Sleeping..."
              : pending
                ? "Starting soon..."
                : "Not sleeping"}
          </Text>
        </View>
        <View className="bg-[#112236] h-11 w-11 rounded-full items-center justify-center border border-[#1e3a5f]">
          <Feather name="moon" size={20} color="#38bdf8" />
        </View>
      </View>

      {/* Divider */}
      <View className="h-px bg-[#112236] mb-5" />

      {/* Last night's stats */}
      <Text className="text-[10px] font-bold text-[#2d5a8e] uppercase tracking-widest mb-3">
        Last night's sleep
      </Text>
      <View className="flex-row gap-2.5 mb-5">
        {Object.values(lastNight).map((s) => (
          <View
            key={s.label}
            className="flex-1 bg-[#0a1628] rounded-[14px] p-3"
          >
            <Text className="text-[9px] font-bold text-[#2d5a8e] uppercase tracking-wider mb-1">
              {s.label}
            </Text>
            <Text className="text-white text-lg font-black tracking-tight">
              {s.value}
            </Text>
            <View className="h-1.5 bg-[#112236] rounded-full overflow-hidden mt-2">
              <View
                className="h-full bg-[#38bdf8] rounded-full"
                style={{ width: `${s.progress}%` }}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Bedtime / wake row */}
      <View className="flex-row justify-between mb-5">
        <View className="flex-row items-center gap-1.5">
          <View className="w-2 h-2 rounded-full bg-[#38bdf8]" />
          <Text className="text-[#2d5a8e] text-xs font-semibold">
            Bedtime {bedtime}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View className="w-2 h-2 rounded-full bg-[#7dd3fc]" />
          <Text className="text-[#2d5a8e] text-xs font-semibold">
            Woke {wakeTime}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View className="h-px bg-[#112236] mb-5" />

      {/* Delay selector */}
      <Text className="text-[10px] font-bold text-[#2d5a8e] uppercase tracking-widest mb-3">
        Sleep in...
      </Text>
      <View className="flex-row gap-2 mb-4">
        {DELAY_OPTIONS.map((opt) => (
          <Pressable
            key={opt.label}
            onPress={() => !sleeping && !pending && setSelectedMin(opt.minutes)}
            className="px-3.5 py-1.5 rounded-full border"
            style={{
              backgroundColor:
                selectedMin === opt.minutes ? "#38bdf8" : "#112236",
              borderColor: selectedMin === opt.minutes ? "#38bdf8" : "#1e3a5f",
            }}
          >
            <Text
              className="text-[11px] font-bold uppercase tracking-wide"
              style={{
                color: selectedMin === opt.minutes ? "#0c1a2e" : "#38bdf8",
              }}
            >
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Action buttons */}
      <View className="flex-row gap-3">
        <Pressable
          onPress={handleSleep}
          className="flex-1 py-3 rounded-[16px] items-center border border-[#1e3a5f]"
          style={{
            backgroundColor: "#112236",
            opacity: sleeping || pending ? 0.4 : 1,
          }}
          disabled={sleeping || pending}
        >
          <Text className="text-[#38bdf8] text-xs font-bold uppercase tracking-widest">
            Sleep
          </Text>
        </Pressable>

        <Pressable
          onPress={handleWakeUp}
          className="flex-1 py-3 rounded-[16px] items-center bg-[#38bdf8]"
          style={{ opacity: sleeping ? 1 : 0.4 }}
          disabled={!sleeping}
        >
          <Text className="text-[#0c1a2e] text-xs font-bold uppercase tracking-widest">
            Wake Up
          </Text>
        </Pressable>
      </View>

      {/* Countdown hint */}
      {pending && countdown > 0 && (
        <Text className="text-[#2d5a8e] text-xs font-semibold text-center mt-3">
          Starting in {fmtCountdown(countdown)}
        </Text>
      )}
    </View>
  );
}
