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
  fetchWorkoutTemplate,
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
      // fetch from your exercises endpoint
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
      // uses createExercisePerSession(sessionId, payload)
      await createExercisePerSession(sessionId, {
        exercise_id: exercise.id,
        sets: 3,
        reps: 10,
        weight: 0,
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

  const MUSCLE_COLORS: Record<string, string> = {
    chest: "#f97316",
    back: "#3b82f6",
    legs: "#8b5cf6",
    shoulders: "#10b981",
    biceps: "#f59e0b",
    triceps: "#ef4444",
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-white rounded-t-[32px] h-[78%]">
          {/* Handle */}
          <View className="w-10 h-1 rounded-full bg-slate-200 self-center mt-4 mb-1" />

          {/* Header */}
          <View className="px-5 pt-3 pb-4">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-base font-black text-slate-800">
                Add Exercise
              </Text>
              <Pressable
                onPress={onClose}
                className="w-9 h-9 rounded-[10px] bg-slate-100 items-center justify-center"
              >
                <Feather name="x" size={16} color="#64748b" />
              </Pressable>
            </View>
            <Text className="text-xs text-slate-400">
              {exercises.length} exercises available
            </Text>
          </View>

          {/* Search */}
          <View className="mx-5 mb-3 flex-row items-center gap-3 bg-slate-50 border border-slate-200 rounded-[14px] px-4 py-3">
            <Feather name="search" size={14} color="#94a3b8" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search by name or muscle…"
              placeholderTextColor="#cbd5e1"
              className="flex-1 text-sm text-slate-800"
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")}>
                <Feather name="x-circle" size={14} color="#94a3b8" />
              </Pressable>
            )}
          </View>

          {/* List */}
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#f97316" />
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: 40,
                gap: 8,
              }}
            >
              {filtered.length === 0 ? (
                <View className="items-center py-12">
                  <Feather name="inbox" size={32} color="#cbd5e1" />
                  <Text className="text-sm text-slate-400 mt-3">
                    No exercises found
                  </Text>
                </View>
              ) : (
                filtered.map((ex) => {
                  const dotColor = MUSCLE_COLORS[ex.muscle_group] ?? "#64748b";
                  return (
                    <Pressable
                      key={ex.id}
                      onPress={() => handleAdd(ex)}
                      disabled={adding === ex.id}
                      className="flex-row items-center gap-3 bg-slate-50 border border-slate-100 rounded-[16px] px-4 py-3.5"
                    >
                      <View
                        className="w-9 h-9 rounded-[10px] items-center justify-center"
                        style={{ backgroundColor: dotColor + "20" }}
                      >
                        <Feather name="zap" size={14} color={dotColor} />
                      </View>
                      <View className="flex-1">
                        <Text
                          className="text-sm font-bold text-slate-800"
                          numberOfLines={1}
                        >
                          {ex.name}
                        </Text>
                        <Text className="text-[11px] text-slate-400 capitalize">
                          {ex.muscle_group} · {ex.equipment} · {ex.difficulty}
                        </Text>
                      </View>
                      {adding === ex.id ? (
                        <ActivityIndicator size="small" color="#f97316" />
                      ) : (
                        <View className="w-7 h-7 rounded-full bg-slate-900 items-center justify-center">
                          <Feather name="plus" size={13} color="#fff" />
                        </View>
                      )}
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
