import { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  fetchExercisesByProgram,
  createExercisePerSession,
} from "@/api/workout";
import type { Exercise } from "@/types/workout";

interface Props {
  category: string;
  visible: boolean;
  sessionId: number;
  onClose: () => void;
  onAdded: () => void;
}

const MUSCLE_COLORS: Record<string, string> = {
  chest: "#f97316",
  back: "#3b82f6",
  legs: "#8b5cf6",
  shoulders: "#10b981",
  biceps: "#f59e0b",
  triceps: "#ef4444",
  core: "#06b6d4",
};

export default function AddExerciseModal({
  category,
  visible,
  sessionId,
  onClose,
  onAdded,
}: Props) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState<number | null>(null);

  useEffect(() => {
    if (visible) loadExercises();
  }, [visible]);

  const loadExercises = async () => {
    try {
      setLoading(true);
      const data = await fetchExercisesByProgram(category);
      setExercises(Array.isArray(data) ? data : (data?.results ?? []));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (exercise: Exercise) => {
    try {
      setAdding(exercise.id);
      await createExercisePerSession(sessionId, {
        exercise_id: exercise.id,
        sets: 3,
        reps: 10,
        weight: 50,
        rest_target: 90,
        notes: "",
      });
      onAdded();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(null);
    }
  };

  const filtered = exercises.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-[32px] h-[82%]">
          {/* ── Dark header ── */}
          <View className="bg-slate-900 rounded-t-[32px] px-5 pt-4 pb-5">
            {/* Handle */}
            <View className="w-10 h-1 rounded-full bg-slate-700 self-center mb-4" />

            {/* Title row */}
            <View className="flex-row items-center justify-between mb-1">
              <View className="flex-row items-center gap-2">
                <Feather name="activity" size={11} color="#f97316" />
                <Text className="text-[10px] font-bold tracking-[2px] uppercase text-orange-400">
                  Add Exercise
                </Text>
              </View>
              <Pressable
                onPress={onClose}
                className="w-8 h-8 rounded-[10px] bg-slate-800 items-center justify-center"
              >
                <Feather name="x" size={15} color="#94a3b8" />
              </Pressable>
            </View>

            <Text
              className="text-xl font-black text-white mb-0.5"
              style={{ letterSpacing: -0.5 }}
            >
              Choose Exercise
            </Text>
            <Text className="text-xs text-slate-500">
              {exercises.length} exercises available
            </Text>

            {/* Search */}
            <View className="flex-row items-center bg-slate-800 border border-slate-700 rounded-[14px] px-4 py-3 mt-4">
              <Feather name="search" size={14} color="#64748b" />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search by name or muscle…"
                placeholderTextColor="#475569"
                className="flex-1 text-sm text-white"
              />
              {search.length > 0 && (
                <Pressable onPress={() => setSearch("")}>
                  <Feather name="x-circle" size={14} color="#64748b" />
                </Pressable>
              )}
            </View>
          </View>

          {/* ── List ── */}
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#f97316" />
              <Text className="text-xs text-slate-400 mt-3">
                Loading exercises…
              </Text>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingTop: 16,
                paddingBottom: 48,
                gap: 10,
              }}
            >
              {filtered.length === 0 ? (
                <View className="items-center py-16">
                  <View className="w-14 h-14 rounded-[16px] bg-slate-100 items-center justify-center mb-4">
                    <Feather name="inbox" size={24} color="#cbd5e1" />
                  </View>
                  <Text className="text-sm font-bold text-slate-400">
                    No exercises found
                  </Text>
                  <Text className="text-xs text-slate-300 mt-1">
                    Try a different search term
                  </Text>
                </View>
              ) : (
                filtered.map((ex) => {
                  const color = MUSCLE_COLORS[ex.muscle_group] ?? "#64748b";
                  const isAdding = adding === ex.id;

                  return (
                    <Pressable
                      key={ex.id}
                      onPress={() => handleAdd(ex)}
                      disabled={isAdding}
                      className="bg-white border border-slate-100 rounded-[18px] overflow-hidden"
                      style={{ opacity: isAdding ? 0.7 : 1 }}
                    >
                      <View className="flex-row items-center gap-3 px-4 py-3.5">
                        {/* Icon */}
                        <View
                          className="w-10 h-10 rounded-[12px] items-center justify-center"
                          style={{
                            backgroundColor: color + "20",
                            borderWidth: 1,
                            borderColor: color + "30",
                          }}
                        >
                          <Feather name="zap" size={15} color={color} />
                        </View>

                        {/* Info */}
                        <View className="flex-1">
                          <Text
                            className="text-sm font-black text-slate-800 mb-0.5"
                            numberOfLines={1}
                            style={{ letterSpacing: -0.3 }}
                          >
                            {ex.name}
                          </Text>
                          <View className="flex-row items-center gap-1.5">
                            <View
                              className="px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor: color + "15",
                                borderWidth: 1,
                                borderColor: color + "30",
                              }}
                            >
                              <Text
                                className="text-[9px] font-bold uppercase tracking-widest"
                                style={{ color }}
                              >
                                {ex.muscle_group}
                              </Text>
                            </View>
                            <Text className="text-[11px] text-slate-400 capitalize">
                              {ex.equipment}
                            </Text>
                            <Text className="text-[11px] text-slate-300">
                              ·
                            </Text>
                            <Text className="text-[11px] text-slate-400 capitalize">
                              {ex.difficulty}
                            </Text>
                          </View>
                        </View>

                        {/* Add button */}
                        {isAdding ? (
                          <ActivityIndicator size="small" color="#f97316" />
                        ) : (
                          <View className="w-8 h-8 rounded-[10px] bg-slate-900 items-center justify-center">
                            <Feather name="plus" size={14} color="#fff" />
                          </View>
                        )}
                      </View>

                      {/* Bottom accent */}
                      <View
                        className="h-0.5"
                        style={{ backgroundColor: color + "30" }}
                      />
                    </Pressable>
                  );
                })
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}
