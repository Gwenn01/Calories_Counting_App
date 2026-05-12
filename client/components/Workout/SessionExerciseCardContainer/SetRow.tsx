import { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { SetRowProps } from "@/types/workout";
import { updateSetPerExercise } from "@/api/workout";

const pad = (n: number) => String(n).padStart(2, "0");

export default function SetRow({
  set,
  restTimer,
  onComplete,
  onDelete,
}: SetRowProps) {
  // ── Existing state ──
  const [weight, setWeight] = useState(String(set.weight ?? ""));
  const [reps, setReps] = useState(String(set.reps ?? ""));
  const [rpe, setRpe] = useState(set.rpe ? String(set.rpe) : "");

  // ── New state ──
  const [saving, setSaving] = useState(false);
  const [restTarget, setRestTarget] = useState(set.rest_target ?? 90);
  const [isWarmup, setIsWarmup] = useState(set.is_warmup ?? false);
  const [isPr, setIsPr] = useState(set.is_pr ?? false);
  const [isDropset, setIsDropset] = useState(set.is_dropset ?? false);

  // ── Auto-save on blur ──
  const handleBlurSave = async () => {
    try {
      setSaving(true);
      await updateSetPerExercise(set.id, {
        weight: parseFloat(weight) || set.weight,
        reps: parseInt(reps) || set.reps,
        rest_target: restTarget,
        is_warmup: isWarmup,
        is_dropset: isDropset,
        is_pr: isPr,
      });
    } catch (e) {
      console.error("Failed to save set:", e);
    } finally {
      setSaving(false);
    }
  };

  // ── Completed + rest timer ──
  if (set.completed && restTimer !== undefined && restTimer > 0) {
    return (
      <View className="bg-orange-50 border border-orange-100 rounded-[5px] px-3 py-3 flex-row items-center">
        <Text className="w-7 text-base font-black text-orange-500 text-center">
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
      <View className="bg-emerald-50 border border-emerald-100 rounded-[5px] px-3 py-3 flex-row items-center">
        <Text className="w-7 text-xs font-black text-emerald-600 text-center">
          {set.set_number}
        </Text>
        <Feather name="check" size={13} color="#10b981" />
        <Text className="flex-1 text-base font-bold text-emerald-700">
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
        {set.is_dropset && (
          <View className="bg-purple-100 border border-purple-200 rounded-full px-2 py-0.5">
            <Text className="text-[9px] font-bold text-purple-500">DROP</Text>
          </View>
        )}
      </View>
    );
  }

  // ── Active ──
  return (
    <View className="bg-white border border-slate-200 rounded-[5px] px-3 py-3">
      {/* Set header */}
      <View className="flex-row items-center justify-between mb-1">
        <View className="flex-row items-center gap-2">
          <View className="w-6 h-6 rounded-full bg-slate-100 items-center justify-center">
            <Text className="text-[10px] font-black text-slate-500">
              {set.set_number}
            </Text>
          </View>
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Set {set.set_number}
          </Text>
          {saving && (
            <View className="flex-row items-center gap-1">
              <View className="w-1 h-1 rounded-full bg-orange-400" />
              <Text className="text-[9px] text-orange-400 font-bold">
                Saving…
              </Text>
            </View>
          )}
        </View>
        <Pressable
          onPress={onDelete}
          className="w-6 h-6 rounded-full bg-slate-100 items-center justify-center"
        >
          <Feather name="x" size={11} color="#94a3b8" />
        </Pressable>
      </View>

      {/* Inputs */}
      <View className="flex-row items-end gap-2 mb-3">
        {/* Weight */}
        <View className="flex-1 items-center">
          <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            lbs
          </Text>
          <View className="w-full bg-slate-50 border border-slate-200 rounded-[12px] py-0.5">
            <TextInput
              value={weight}
              onChangeText={setWeight}
              onBlur={handleBlurSave}
              keyboardType="decimal-pad"
              className="text-xs font-black text-slate-800 text-center"
              selectTextOnFocus
            />
          </View>
        </View>

        <View className="w-px h-8 bg-slate-100 mb-1" />

        {/* Reps */}
        <View className="flex-1 items-center">
          <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            reps
          </Text>
          <View className="w-full bg-slate-50 border border-slate-200 rounded-[12px] py-0.5">
            <TextInput
              value={reps}
              onChangeText={setReps}
              onBlur={handleBlurSave}
              keyboardType="number-pad"
              className="text-xs font-black text-slate-800 text-center"
              selectTextOnFocus
            />
          </View>
        </View>

        <View className="w-px h-8 bg-slate-100 mb-1" />

        {/* RPE */}
        <View className="flex-1 items-center">
          <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            rpe
          </Text>
          <View className="w-full bg-slate-50 border border-slate-200 rounded-[12px] py-0.5">
            <TextInput
              value={rpe}
              onChangeText={setRpe}
              keyboardType="decimal-pad"
              placeholder="—"
              placeholderTextColor="#cbd5e1"
              className="text-xs font-black text-slate-800 text-center"
              selectTextOnFocus
            />
          </View>
        </View>

        {/* Complete */}
        <Pressable
          onPress={() =>
            onComplete(
              parseFloat(weight) || 0,
              parseInt(reps) || 0,
              rpe ? parseFloat(rpe) : null,
              restTarget, // ← add this
            )
          }
          className="w-11 h-11 bg-slate-900 rounded-[12px] items-center justify-center"
        >
          <Feather name="check" size={15} color="#fff" />
        </Pressable>
      </View>

      {/* ── Options row ── */}
      <View className="flex-row items-center pt-2.5 border-t border-slate-100">
        {/* Rest target */}
        <View className="flex-row items-center gap-1 flex-1">
          <Feather name="clock" size={11} color="#94a3b8" />
          <Text className="text-[10px] font-bold text-slate-400">Rest</Text>
          <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-full overflow-hidden">
            <Pressable
              onPress={() => {
                const next = Math.max(30, restTarget - 15);
                setRestTarget(next);
                updateSetPerExercise(set.id, { rest_target: next });
              }}
              className="px-2 py-1"
            >
              <Text className="text-xs font-black text-slate-500">−</Text>
            </Pressable>
            <Text className="text-[10px] font-black text-slate-700 px-1">
              {restTarget}s
            </Text>
            <Pressable
              onPress={() => {
                const next = Math.min(300, restTarget + 15);
                setRestTarget(next);
                updateSetPerExercise(set.id, { rest_target: next });
              }}
              className="px-2 py-1"
            >
              <Text className="text-xs font-black text-slate-500">+</Text>
            </Pressable>
          </View>
        </View>

        {/* Warmup toggle */}
        <Pressable
          onPress={() => {
            const next = !isWarmup;
            setIsWarmup(next);
            updateSetPerExercise(set.id, { is_warmup: next });
          }}
          className="flex-row items-center rounded-full px-2 py-1"
          style={{
            backgroundColor: isWarmup ? "#eff6ff" : "#f8fafc",
            borderWidth: 1,
            borderColor: isWarmup ? "#bfdbfe" : "#e2e8f0",
          }}
        >
          <Feather
            name="sun"
            size={11}
            color={isWarmup ? "#3b82f6" : "#94a3b8"}
          />
          <Text
            className="text-[10px] font-bold"
            style={{ color: isWarmup ? "#3b82f6" : "#94a3b8" }}
          >
            Warm
          </Text>
        </Pressable>

        {/* PR toggle */}
        <Pressable
          onPress={() => {
            const next = !isPr;
            setIsPr(next);
            updateSetPerExercise(set.id, { is_pr: next });
          }}
          className="flex-row items-center rounded-full px-2 py-1"
          style={{
            backgroundColor: isPr ? "#fefce8" : "#f8fafc",
            borderWidth: 1,
            borderColor: isPr ? "#fde68a" : "#e2e8f0",
          }}
        >
          <Feather
            name="award"
            size={11}
            color={isPr ? "#f59e0b" : "#94a3b8"}
          />
          <Text
            className="text-[10px] font-bold"
            style={{ color: isPr ? "#f59e0b" : "#94a3b8" }}
          >
            PR
          </Text>
        </Pressable>

        {/* Dropset toggle */}
        <Pressable
          onPress={() => {
            const next = !isDropset;
            setIsDropset(next);
            updateSetPerExercise(set.id, { is_dropset: next });
          }}
          className="flex-row items-center rounded-full px-2 py-1"
          style={{
            backgroundColor: isDropset ? "#fdf4ff" : "#f8fafc",
            borderWidth: 1,
            borderColor: isDropset ? "#e9d5ff" : "#e2e8f0",
          }}
        >
          <Feather
            name="trending-down"
            size={11}
            color={isDropset ? "#a855f7" : "#94a3b8"}
          />
          <Text
            className="text-[10px] font-bold"
            style={{ color: isDropset ? "#a855f7" : "#94a3b8" }}
          >
            Drop
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
