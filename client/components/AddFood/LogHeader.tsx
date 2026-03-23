import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MotiView } from "moti";
import { useState } from "react";

interface Props {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
}

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function LogHeader({ currentDate, onPrev, onNext }: Props) {
  const isCurrentDay = currentDate.toDateString() === new Date().toDateString();
  const [direction, setDirection] = useState<"left" | "right">("right");

  const handlePrev = () => {
    setDirection("left");
    onPrev();
  };

  const handleNext = () => {
    setDirection("right");
    onNext();
  };

  return (
    <View className="flex-row items-center justify-between mb-4 bg-white rounded-[20px] px-4 py-4 border border-slate-100">
      {/* Prev */}
      <Pressable
        onPress={handlePrev}
        className="w-10 h-10 rounded-[14px] bg-slate-900 border border-slate-100 items-center justify-center"
      >
        <Feather name="chevron-left" size={18} color="#fff" />
      </Pressable>

      {/* Fade only — no translateX */}
      <MotiView
        key={currentDate.toISOString()}
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "timing", duration: 200 }}
        className="flex-1 items-center px-3 gap-0.5"
      >
        <View className="flex-row items-center gap-1.5 mb-0.5">
          <Feather name="file-text" size={11} color="#94a3b8" />
          <Text className="text-[10px] font-bold tracking-[2px] uppercase text-slate-400">
            Food Log
          </Text>
        </View>

        <Text className="text-[11px] font-semibold text-slate-400">
          {currentDate.toLocaleDateString("en-US", { weekday: "long" })}
        </Text>

        <Text
          className="text-xl font-black text-slate-900"
          style={{ letterSpacing: -0.5 }}
        >
          {formatDate(currentDate)}
        </Text>

        {isCurrentDay && (
          <View className="mt-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-0.5">
            <Text className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
              Today
            </Text>
          </View>
        )}
      </MotiView>

      {/* Next */}
      <Pressable
        onPress={handleNext}
        className="w-10 h-10 rounded-[14px] bg-slate-900 items-center justify-center"
      >
        <Feather name="chevron-right" size={18} color="#fff" />
      </Pressable>
    </View>
  );
}
