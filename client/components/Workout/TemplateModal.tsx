import React, { useState, useEffect } from "react";
import { View, Text, Modal, Pressable, ScrollView, Alert } from "react-native";
import {
  createWorkoutTemplate,
  editWorkoutTemplate,
  createTemplateExercise,
  editTemplateExercise,
  deleteTemplateExercise,
  fetchExercisesByProgram,
} from "@/api/workout";
import type {
  Exercise,
  WorkoutTemplate,
  TemplateExercise,
} from "@/types/workout";
import TemplateInfoSection from "@/components/Workout/TemplateModalContainer/TemplateInfoSection";
import CategorySection from "@/components/Workout/TemplateModalContainer/CategorySection";
import ExerciseSection from "@/components/Workout/TemplateModalContainer/ExerciseSection";

type Props = {
  visible: boolean;
  onClose: () => void;
  initialData?: WorkoutTemplate | null;
  onSaved: (template: WorkoutTemplate) => void;
};

const blankExerciseForm = () => ({
  default_sets: "3",
  default_reps: "8",
  default_weight: "0",
  default_rest: "90",
  notes: "",
});

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

  // ── Server exercises ──────────────────────────────────────────
  const [serverExercises, setServerExercises] = useState<Exercise[]>([]);
  const [exercisesLoading, setExercisesLoading] = useState(false);
  const [search, setSearch] = useState("");

  // ── Template exercises ────────────────────────────────────────
  const [exercises, setExercises] = useState<TemplateExercise[]>([]);
  const [savedTemplateId, setSavedTemplateId] = useState<number | null>(null);

  // ── Exercise form state ───────────────────────────────────────
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

  // ── Load exercises when picker opens ─────────────────────────
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

  // ── Exercise handlers ─────────────────────────────────────────
  const handlePickExercise = (ex: Exercise) => {
    setSelectedExercise(ex);
    setExerciseForm(blankExerciseForm());
    setShowExercisePicker(false);
    setShowExerciseForm(true);
  };

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

  const handleDeleteExercise = async (te: TemplateExercise) => {
    try {
      await deleteTemplateExercise(te.id);
      setExercises((prev) => prev.filter((e) => e.id !== te.id));
    } catch (e) {
      console.error(e);
    }
  };

  const filteredExercises = serverExercises.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()),
  );

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
            <TemplateInfoSection
              name={name}
              description={description}
              duration={duration}
              onNameChange={setName}
              onDescriptionChange={setDescription}
              onDurationChange={setDuration}
            />

            <CategorySection
              category={category}
              onCategoryChange={setCategory}
            />

            <ExerciseSection
              exercises={exercises}
              showExercisePicker={showExercisePicker}
              showExerciseForm={showExerciseForm}
              exercisesLoading={exercisesLoading}
              exerciseLoading={exerciseLoading}
              filteredExercises={filteredExercises}
              selectedExercise={selectedExercise}
              editingExercise={editingExercise}
              exerciseForm={exerciseForm}
              search={search}
              category={category}
              onSearchChange={setSearch}
              onOpenPicker={() => setShowExercisePicker(true)}
              onClosePicker={() => {
                setShowExercisePicker(false);
                setSearch("");
              }}
              onPickExercise={handlePickExercise}
              onExerciseFormChange={(key, val) =>
                setExerciseForm((p) => ({ ...p, [key]: val }))
              }
              onSaveExercise={handleSaveExercise}
              onCancelExerciseForm={() => {
                setShowExerciseForm(false);
                setEditingExercise(null);
                setSelectedExercise(null);
              }}
              onChangeExercise={() => {
                setShowExerciseForm(false);
                setShowExercisePicker(true);
              }}
              onEditExercise={handleOpenEditExercise}
              onDeleteExercise={handleDeleteExercise}
            />
          </ScrollView>

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
