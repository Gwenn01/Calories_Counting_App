import { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { SetRowProps } from "@/types/workout";

const pad = (n: number) => String(n).padStart(2, "0");

export default function SetRow({
  set,
  restTimer,
  onComplete,
  onDelete,
}: SetRowProps) {
  const [weight, setWeight] = useState(String(set.weight ?? ""));
  const [reps, setReps] = useState(String(set.reps ?? ""));
  const [rpe, setRpe] = useState(set.rpe ? String(set.rpe) : "");

  // ── Completed + rest timer ──
  if (set.completed && restTimer !== undefined && restTimer > 0) {
    return (
      <View className="bg-orange-50 border border-orange-100 rounded-[12px] px-3 py-2.5 flex-row items-center gap-2">
        <Text className="w-7 text-xs font-black text-orange-500 text-center">
          {set.set_number}
        </Text>
        <Feather name="check-circle" size={13} color="#f97316" />
        <Text className="flex-1 text-xs font-bold text-orange-700">
          {set.weight}kg × {set.reps} reps
        </Text>
        <View className="flex-row items-center gap-1 bg-orange-100 border border-orange-200 rounded-full px-2 py-0.5">
          <Feather name="clock" size={10} color="#ea580c" />
          <Text className="text-xs font-black text-orange-700">
            {pad(Math.floor(restTimer / 60))}:{pad(restTimer % 60)}
          </Text>
        </View>
      </View>
    );
  }

  // ── Completed ──
  if (set.completed) {
    return (
      <View className="bg-emerald-50 border border-emerald-100 rounded-[12px] px-3 py-2.5 flex-row items-center gap-2">
        <Text className="w-7 text-xs font-black text-emerald-600 text-center">
          {set.set_number}
        </Text>
        <Feather name="check" size={13} color="#10b981" />
        <Text className="flex-1 text-xs font-bold text-emerald-700">
          {set.weight}kg × {set.reps} reps
          {set.rpe ? ` · RPE ${set.rpe}` : ""}
        </Text>
        {set.is_pr && (
          <View className="bg-yellow-50 border border-yellow-200 rounded-full px-2 py-0.5">
            <Text className="text-[9px] font-black text-yellow-600">PR</Text>
          </View>
        )}
        {set.is_warmup && (
          <View className="bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5">
            <Text className="text-[9px] font-bold text-blue-500">WARM</Text>
          </View>
        )}
      </View>
    );
  }

  // ── Active ──
  return (
    <View className="flex-row items-center gap-1.5 py-0.5">
      <Text className="w-7 text-xs font-black text-slate-400 text-center">
        {set.set_number}
      </Text>

      <View className="flex-1 bg-slate-50 border border-slate-200 rounded-[10px] px-1 py-2">
        <TextInput
          value={weight}
          onChangeText={setWeight}
          keyboardType="decimal-pad"
          className="text-sm font-bold text-slate-800 text-center"
          selectTextOnFocus
        />
      </View>

      <View className="flex-1 bg-slate-50 border border-slate-200 rounded-[10px] px-1 py-2">
        <TextInput
          value={reps}
          onChangeText={setReps}
          keyboardType="number-pad"
          className="text-sm font-bold text-slate-800 text-center"
          selectTextOnFocus
        />
      </View>

      <View className="flex-1 bg-slate-50 border border-slate-200 rounded-[10px] px-1 py-2">
        <TextInput
          value={rpe}
          onChangeText={setRpe}
          keyboardType="decimal-pad"
          placeholder="—"
          placeholderTextColor="#cbd5e1"
          className="text-sm font-bold text-slate-800 text-center"
          selectTextOnFocus
        />
      </View>

      <Pressable
        onPress={() =>
          onComplete(
            parseFloat(weight) || 0,
            parseInt(reps) || 0,
            rpe ? parseFloat(rpe) : null,
          )
        }
        className="w-12 bg-slate-900 rounded-[10px] py-2.5 items-center justify-center"
      >
        <Feather name="check" size={14} color="#fff" />
      </Pressable>

      <Pressable onPress={onDelete} className="w-7 items-center justify-center">
        <Feather name="trash-2" size={13} color="#cbd5e1" />
      </Pressable>
    </View>
  );
}
