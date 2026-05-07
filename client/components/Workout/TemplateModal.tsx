// components/Workout/TemplateModal.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import {
  createWorkoutTemplate,
  editWorkoutTemplate,
  createTemplateExercise,
  editTemplateExercise,
  deleteTemplateExercise,
  fetchExercisesByProgram, // ← add this to your api/workout.ts
} from "@/api/workout";
import type {
  Exercise,
  WorkoutTemplate,
  TemplateExercise,
} from "@/types/workout";

type Props = {
  visible: boolean;
  onClose: () => void;
  initialData?: WorkoutTemplate | null;
  onSaved: (template: WorkoutTemplate) => void;
};

const CATEGORIES = [
  "push",
  "pull",
  "legs",
  "upper",
  "lower",
  "full_body",
  "cardio",
];

const blankExerciseForm = () => ({
  default_sets: "3",
  default_reps: "8",
  default_weight: "0",
  default_rest: "90",
  notes: "",
});

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: "#10b981",
  intermediate: "#f97316",
  advanced: "#ef4444",
};

export default function TemplateModal({
  visible,
  onClose,
  initialData,
  onSaved,
}: Props) {
  // ── Template fields ───────────────────────────────────────────
  const [name, setName] = useState("");
  const [category, setCategory] = useState("push");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("60");
  const [loading, setLoading] = useState(false);

  // ── Exercise list (from server) ───────────────────────────────
  const [serverExercises, setServerExercises] = useState<Exercise[]>([]);
  const [exercisesLoading, setExercisesLoading] = useState(false);
  const [search, setSearch] = useState("");

  // ── Template exercises ────────────────────────────────────────
  const [exercises, setExercises] = useState<TemplateExercise[]>([]);
  const [savedTemplateId, setSavedTemplateId] = useState<number | null>(null);

  // ── Exercise form ─────────────────────────────────────────────
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [exerciseForm, setExerciseForm] = useState(blankExerciseForm());
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [editingExercise, setEditingExercise] =
    useState<TemplateExercise | null>(null);
  const [exerciseLoading, setExerciseLoading] = useState(false);

  // ── Reset on open ─────────────────────────────────────────────
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setDescription(initialData.description ?? "");
      setDuration(String(initialData.estimated_duration));
      setExercises(initialData.template_exercises ?? []);
      setSavedTemplateId(initialData.id);
    } else {
      setName("");
      setCategory("push");
      setDescription("");
      setDuration("60");
      setExercises([]);
      setSavedTemplateId(null);
    }
    setShowExercisePicker(false);
    setShowExerciseForm(false);
    setEditingExercise(null);
    setSelectedExercise(null);
    setSearch("");
  }, [initialData, visible]);

  // ── Fetch exercises when category changes ─────────────────────
  useEffect(() => {
    if (!showExercisePicker) return;

    const load = async () => {
      setExercisesLoading(true);
      setServerExercises([]);

      try {
        const data = await fetchExercisesByProgram(category);
        setServerExercises(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setExercisesLoading(false);
      }
    };

    load();
  }, [showExercisePicker, category]);

  const filteredExercises = serverExercises.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()),
  );

  // ── Save template ─────────────────────────────────────────────
  const handleSave = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const payload = {
        name,
        category,
        description,
        is_public: false,
        estimated_duration: Number(duration) || 60,
      };
      let saved: WorkoutTemplate;
      if (initialData) {
        saved = await editWorkoutTemplate(initialData.id, payload as any);
      } else {
        saved = await createWorkoutTemplate(payload as any);
        setSavedTemplateId(saved.id);
      }
      onSaved({ ...saved, template_exercises: exercises });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // ── Pick exercise → show form ─────────────────────────────────
  const handlePickExercise = (ex: Exercise) => {
    setSelectedExercise(ex);
    setExerciseForm(blankExerciseForm());
    setShowExercisePicker(false);
    setShowExerciseForm(true);
  };

  // ── Open edit form ────────────────────────────────────────────
  const handleOpenEditExercise = (te: TemplateExercise) => {
    setEditingExercise(te);
    setSelectedExercise({
      id: te.exercise.id,
      name: te.exercise.name,
      muscle_group: te.exercise.muscle_group,
      equipment: te.exercise.equipment,
      difficulty: "",
      exercise_type: "",
    });
    setExerciseForm({
      default_sets: String(te.default_sets),
      default_reps: String(te.default_reps),
      default_weight: String(te.default_weight),
      default_rest: String(te.default_rest),
      notes: te.notes ?? "",
    });
    setShowExerciseForm(true);
  };

  // ── Save exercise ─────────────────────────────────────────────
  const handleSaveExercise = async () => {
    const templateId = savedTemplateId ?? initialData?.id;
    if (!templateId) {
      Alert.alert(
        "Save template first",
        "Please save the template before adding exercises.",
      );
      return;
    }
    if (!selectedExercise) return;

    setExerciseLoading(true);
    try {
      const payload = {
        template: templateId,
        exercise_id: selectedExercise.id,
        order: editingExercise ? editingExercise.order : exercises.length + 1,
        default_sets: Number(exerciseForm.default_sets) || 3,
        default_reps: Number(exerciseForm.default_reps) || 8,
        default_weight: Number(exerciseForm.default_weight) || 0,
        default_rest: Number(exerciseForm.default_rest) || 90,
        notes: exerciseForm.notes,
      };

      if (editingExercise) {
        const updated = await editTemplateExercise(
          editingExercise.id,
          payload as any,
        );

        setExercises((prev) =>
          prev.map((e) => (e.id === editingExercise.id ? updated : e)),
        );
      } else {
        const created = await createTemplateExercise(payload as any);

        setExercises((prev) => [...prev, created]);
      }

      setShowExerciseForm(false);
      setEditingExercise(null);
      setSelectedExercise(null);
    } catch (e) {
      console.error(e);
    } finally {
      setExerciseLoading(false);
    }
  };

  // ── Delete exercise ───────────────────────────────────────────
  const handleDeleteExercise = (te: TemplateExercise) => {
    Alert.alert("Remove Exercise", `Remove "${te.exercise.name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTemplateExercise(te.id);
            setExercises((prev) => prev.filter((e) => e.id !== te.id));
          } catch (e) {
            console.error(e);
          }
        },
      },
    ]);
  };

  // ─────────────────────────────────────────────────────────────
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-white rounded-t-3xl px-5 pt-6 pb-10 max-h-[92%]">
          <Text className="text-xl font-extrabold mb-5">
            {initialData ? "Edit Template" : "Create Template"}
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* ── Template Info ── */}
            <Section label="Template Info">
              <IconInput
                fieldKey="name"
                label="Template Name"
                value={name}
                onChange={setName}
                placeholder="e.g. Push Day A"
              />
              <IconInput
                fieldKey="description"
                label="Description"
                value={description}
                onChange={setDescription}
                placeholder="Optional notes"
              />
              <IconInput
                fieldKey="duration"
                label="Est. Duration"
                value={duration}
                onChange={setDuration}
                keyboard="numeric"
                unit="min"
              />
            </Section>

            {/* ── Category ── */}
            <Section label="Category">
              <View className="flex-row flex-wrap" style={{ gap: 8 }}>
                {CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => setCategory(cat)}
                    className={`py-2 px-4 rounded-xl border items-center ${
                      category === cat
                        ? "bg-orange-50 border-orange-400"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <Text
                      className={`font-bold text-xs capitalize ${
                        category === cat ? "text-orange-500" : "text-slate-400"
                      }`}
                    >
                      {cat.replace("_", " ")}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Section>

            {/* ── Exercises ── */}
            <Section
              label="Exercises"
              action={
                !showExercisePicker && !showExerciseForm ? (
                  <Pressable
                    onPress={() => setShowExercisePicker(true)}
                    className="flex-row items-center gap-x-1 bg-orange-50 border border-orange-100 px-3 py-1 rounded-xl"
                  >
                    <Ionicons name="add" size={13} color="#f97316" />
                    <Text className="text-xs font-bold text-orange-500">
                      Add
                    </Text>
                  </Pressable>
                ) : null
              }
            >
              {/* ── Exercise Picker ── */}
              {showExercisePicker && (
                <View className="mb-3">
                  {/* Search bar */}
                  <View className="flex-row items-center border border-slate-200 rounded-xl px-3 py-2 bg-white mb-2">
                    <Feather name="search" size={14} color="#94a3b8" />
                    <TextInput
                      value={search}
                      onChangeText={setSearch}
                      placeholder={`Search ${category.replace("_", " ")} exercises...`}
                      placeholderTextColor="#cbd5e1"
                      className="flex-1 text-slate-800 text-sm ml-2"
                      style={{ padding: 0 }}
                    />
                    {search.length > 0 && (
                      <Pressable onPress={() => setSearch("")}>
                        <Feather name="x" size={14} color="#94a3b8" />
                      </Pressable>
                    )}
                  </View>

                  {/* Category badge */}
                  <View className="flex-row items-center mb-2">
                    <View className="bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full">
                      <Text className="text-[10px] font-bold text-orange-500 capitalize">
                        {category.replace("_", " ")} ·{" "}
                        {filteredExercises.length} exercises
                      </Text>
                    </View>
                  </View>

                  {/* List */}
                  {exercisesLoading ? (
                    <View className="py-6 items-center">
                      <ActivityIndicator size="small" color="#f97316" />
                      <Text className="text-xs text-slate-400 mt-2">
                        Loading exercises...
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{ maxHeight: 260 }}
                      className="rounded-2xl border border-slate-100 bg-white overflow-hidden"
                    >
                      <ScrollView
                        nestedScrollEnabled
                        showsVerticalScrollIndicator={false}
                      >
                        {filteredExercises.map((ex, i) => (
                          <Pressable
                            key={ex.id}
                            onPress={() => handlePickExercise(ex)}
                            className={`flex-row items-center px-3 py-3 ${
                              i < filteredExercises.length - 1
                                ? "border-b border-slate-50"
                                : ""
                            }`}
                            style={({ pressed }) => ({
                              opacity: pressed ? 0.7 : 1,
                            })}
                          >
                            <View className="w-8 h-8 rounded-xl bg-orange-100 items-center justify-center mr-3">
                              <Ionicons
                                name="barbell-outline"
                                size={14}
                                color="#f97316"
                              />
                            </View>
                            <View className="flex-1">
                              <Text className="text-sm font-bold text-slate-700">
                                {ex.name}
                              </Text>
                              <Text className="text-xs text-slate-400 mt-0.5 capitalize">
                                {ex.muscle_group} · {ex.equipment}
                              </Text>
                            </View>
                            <View
                              className="px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor: `${DIFFICULTY_COLOR[ex.difficulty] ?? "#64748b"}18`,
                              }}
                            >
                              <Text
                                className="text-[9px] font-bold capitalize"
                                style={{
                                  color:
                                    DIFFICULTY_COLOR[ex.difficulty] ??
                                    "#64748b",
                                }}
                              >
                                {ex.difficulty}
                              </Text>
                            </View>
                          </Pressable>
                        ))}
                        {filteredExercises.length === 0 && (
                          <View className="py-6 items-center">
                            <Text className="text-sm text-slate-400">
                              No exercises found
                            </Text>
                          </View>
                        )}
                      </ScrollView>
                    </View>
                  )}

                  {/* Cancel picker */}
                  <Pressable
                    onPress={() => {
                      setShowExercisePicker(false);
                      setSearch("");
                    }}
                    className="mt-2 py-2.5 rounded-xl bg-slate-100 items-center"
                  >
                    <Text className="text-slate-500 font-semibold text-sm">
                      Cancel
                    </Text>
                  </Pressable>
                </View>
              )}

              {/* ── Exercise Config Form ── */}
              {showExerciseForm && selectedExercise && (
                <View
                  className="rounded-2xl p-4 mb-3"
                  style={{
                    borderWidth: 1,
                    borderColor: "#fed7aa",
                    backgroundColor: "#fff7ed",
                  }}
                >
                  {/* Selected exercise header */}
                  <View
                    className="flex-row items-center mb-4 pb-3"
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: "#ffedd5",
                    }}
                  >
                    <View className="w-9 h-9 rounded-xl bg-orange-100 items-center justify-center mr-3">
                      <Ionicons
                        name="barbell-outline"
                        size={16}
                        color="#f97316"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-black text-slate-800">
                        {selectedExercise.name}
                      </Text>
                      <Text className="text-xs text-slate-400 capitalize mt-0.5">
                        {selectedExercise.muscle_group} ·{" "}
                        {selectedExercise.equipment}
                      </Text>
                    </View>
                    {!editingExercise && (
                      <Pressable
                        onPress={() => {
                          setShowExerciseForm(false);
                          setShowExercisePicker(true);
                        }}
                      >
                        <Text className="text-xs text-orange-500 font-bold">
                          Change
                        </Text>
                      </Pressable>
                    )}
                  </View>

                  <Text className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-3">
                    Set Defaults
                  </Text>

                  <View className="flex-row gap-x-3">
                    <View className="flex-1">
                      <IconInput
                        fieldKey="default_sets"
                        label="Sets"
                        value={exerciseForm.default_sets}
                        onChange={(v) =>
                          setExerciseForm((p) => ({ ...p, default_sets: v }))
                        }
                        keyboard="numeric"
                      />
                    </View>
                    <View className="flex-1">
                      <IconInput
                        fieldKey="default_reps"
                        label="Reps"
                        value={exerciseForm.default_reps}
                        onChange={(v) =>
                          setExerciseForm((p) => ({ ...p, default_reps: v }))
                        }
                        keyboard="numeric"
                      />
                    </View>
                  </View>

                  <View className="flex-row gap-x-3">
                    <View className="flex-1">
                      <IconInput
                        fieldKey="default_weight"
                        label="Weight"
                        value={exerciseForm.default_weight}
                        onChange={(v) =>
                          setExerciseForm((p) => ({ ...p, default_weight: v }))
                        }
                        keyboard="numeric"
                        unit="lbs"
                      />
                    </View>
                    <View className="flex-1">
                      <IconInput
                        fieldKey="default_rest"
                        label="Rest"
                        value={exerciseForm.default_rest}
                        onChange={(v) =>
                          setExerciseForm((p) => ({ ...p, default_rest: v }))
                        }
                        keyboard="numeric"
                        unit="sec"
                      />
                    </View>
                  </View>

                  <IconInput
                    fieldKey="notes"
                    label="Notes"
                    value={exerciseForm.notes}
                    onChange={(v) =>
                      setExerciseForm((p) => ({ ...p, notes: v }))
                    }
                    placeholder="Optional cues"
                  />

                  <View className="flex-row gap-x-2 mt-1">
                    <Pressable
                      onPress={() => {
                        setShowExerciseForm(false);
                        setEditingExercise(null);
                        setSelectedExercise(null);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-white border border-slate-200 items-center"
                    >
                      <Text className="text-slate-500 font-semibold text-sm">
                        Cancel
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={handleSaveExercise}
                      disabled={exerciseLoading}
                      className="flex-[2] py-2.5 rounded-xl bg-orange-500 items-center"
                    >
                      <Text className="text-white font-bold text-sm">
                        {exerciseLoading
                          ? "Saving..."
                          : editingExercise
                            ? "Update"
                            : "Add Exercise"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {/* ── Exercise List ── */}
              {exercises.length === 0 &&
                !showExercisePicker &&
                !showExerciseForm && (
                  <View
                    className="py-6 items-center rounded-2xl"
                    style={{
                      borderWidth: 1.5,
                      borderColor: "#f1f5f9",
                      borderStyle: "dashed",
                    }}
                  >
                    <Text className="text-slate-300 text-sm font-medium">
                      No exercises yet
                    </Text>
                    <Text className="text-slate-200 text-xs mt-0.5">
                      Tap Add to pick from the library
                    </Text>
                  </View>
                )}

              {exercises.map((te, i) => (
                <View
                  key={te.id}
                  className={`flex-row items-center py-3 ${
                    i < exercises.length - 1 ? "border-b border-slate-100" : ""
                  }`}
                >
                  <View className="w-6 h-6 rounded-lg bg-orange-100 items-center justify-center mr-3">
                    <Text className="text-[10px] font-black text-orange-500">
                      {te.order}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-slate-700">
                      {te.exercise.name}
                    </Text>
                    <Text className="text-xs text-slate-400 mt-0.5">
                      {te.default_sets}×{te.default_reps} · {te.default_weight}
                      lbs · {te.default_rest}s rest
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => handleOpenEditExercise(te)}
                    className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 items-center justify-center ml-1"
                  >
                    <Feather name="edit-2" size={12} color="#94a3b8" />
                  </Pressable>
                  <Pressable
                    onPress={() => handleDeleteExercise(te)}
                    className="w-8 h-8 rounded-xl bg-red-50 border border-red-100 items-center justify-center ml-1"
                  >
                    <Feather name="trash-2" size={12} color="#ef4444" />
                  </Pressable>
                </View>
              ))}
            </Section>
          </ScrollView>

          {/* Bottom buttons */}
          <View className="flex-row gap-3 mt-4">
            <Pressable
              onPress={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-100"
            >
              <Text className="text-center font-semibold text-slate-500">
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-orange-500"
            >
              <Text className="text-center text-white font-semibold">
                {loading ? "Saving..." : initialData ? "Save" : "Create"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ── Section ── */
function Section({
  label,
  children,
  action,
}: {
  label: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <View
      className="rounded-[20px] p-4 mb-4"
      style={{
        borderWidth: 1,
        borderColor: "#f1f5f9",
        backgroundColor: "#f8fafc",
      }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">
          {label}
        </Text>
        {action}
      </View>
      {children}
    </View>
  );
}

/* ── IconInput ── */
function IconInput({
  fieldKey,
  label,
  value,
  onChange,
  keyboard = "default",
  unit,
  placeholder,
}: {
  fieldKey: string;
  label: string;
  value: string;
  unit?: string;
  placeholder?: string;
  onChange: (v: string) => void;
  keyboard?: string;
}) {
  const META: Record<
    string,
    { icon: string; color: string; bg: string; border: string }
  > = {
    name: {
      icon: "edit-2",
      color: "#f97316",
      bg: "#fff7ed",
      border: "#ffedd5",
    },
    description: {
      icon: "file-text",
      color: "#8b5cf6",
      bg: "#f5f3ff",
      border: "#ede9fe",
    },
    duration: {
      icon: "clock",
      color: "#3b82f6",
      bg: "#eff6ff",
      border: "#dbeafe",
    },
    default_sets: {
      icon: "layers",
      color: "#10b981",
      bg: "#f0fdf4",
      border: "#dcfce7",
    },
    default_reps: {
      icon: "repeat",
      color: "#3b82f6",
      bg: "#eff6ff",
      border: "#dbeafe",
    },
    default_weight: {
      icon: "trending-up",
      color: "#ec4899",
      bg: "#fdf2f8",
      border: "#fce7f3",
    },
    default_rest: {
      icon: "clock",
      color: "#f59e0b",
      bg: "#fffbeb",
      border: "#fef3c7",
    },
    notes: {
      icon: "message-square",
      color: "#8b5cf6",
      bg: "#f5f3ff",
      border: "#ede9fe",
    },
  };
  const meta = META[fieldKey] ?? {
    icon: "edit",
    color: "#64748b",
    bg: "#f8fafc",
    border: "#e2e8f0",
  };

  return (
    <View className="flex-row items-center mb-3">
      <View
        className="w-9 h-9 rounded-[11px] items-center justify-center mr-3"
        style={{
          backgroundColor: meta.bg,
          borderWidth: 1,
          borderColor: meta.border,
          shadowColor: meta.color,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Feather name={meta.icon as any} size={14} color={meta.color} />
      </View>
      <View className="flex-1">
        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
          {label}
        </Text>
        <View className="flex-row items-center border border-slate-200 rounded-xl px-3 py-2 bg-white">
          <TextInput
            value={value}
            onChangeText={onChange}
            keyboardType={keyboard as any}
            placeholder={placeholder}
            placeholderTextColor="#cbd5e1"
            className="flex-1 text-slate-800 font-semibold text-sm"
            style={{ padding: 0 }}
          />
          {unit && (
            <Text className="text-slate-400 text-xs font-bold ml-1">
              {unit}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
