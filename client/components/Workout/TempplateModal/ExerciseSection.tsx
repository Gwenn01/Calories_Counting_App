import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Section } from "./Section";
import { IconInput } from "./IconInput";
import type { Exercise, TemplateExercise } from "@/types/workout";

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: "#10b981",
  intermediate: "#f97316",
  advanced: "#ef4444",
};

type Props = {
  exercises: TemplateExercise[];
  showExercisePicker: boolean;
  showExerciseForm: boolean;
  exercisesLoading: boolean;
  exerciseLoading: boolean;
  filteredExercises: Exercise[];
  selectedExercise: Exercise | null;
  editingExercise: TemplateExercise | null;
  exerciseForm: {
    default_sets: string;
    default_reps: string;
    default_weight: string;
    default_rest: string;
    notes: string;
  };
  search: string;
  category: string;
  onSearchChange: (v: string) => void;
  onOpenPicker: () => void;
  onClosePicker: () => void;
  onPickExercise: (ex: Exercise) => void;
  onExerciseFormChange: (key: string, val: string) => void;
  onSaveExercise: () => void;
  onCancelExerciseForm: () => void;
  onChangeExercise: () => void;
  onEditExercise: (te: TemplateExercise) => void;
  onDeleteExercise: (te: TemplateExercise) => void;
};

export default function ExerciseSection({
  exercises,
  showExercisePicker,
  showExerciseForm,
  exercisesLoading,
  exerciseLoading,
  filteredExercises,
  selectedExercise,
  editingExercise,
  exerciseForm,
  search,
  category,
  onSearchChange,
  onOpenPicker,
  onClosePicker,
  onPickExercise,
  onExerciseFormChange,
  onSaveExercise,
  onCancelExerciseForm,
  onChangeExercise,
  onEditExercise,
  onDeleteExercise,
}: Props) {
  return (
    <Section
      label="Exercises"
      action={
        !showExercisePicker && !showExerciseForm ? (
          <Pressable
            onPress={onOpenPicker}
            className="flex-row items-center gap-x-1 bg-orange-50 border border-orange-100 px-3 py-1 rounded-xl"
          >
            <Ionicons name="add" size={13} color="#f97316" />
            <Text className="text-xs font-bold text-orange-500">Add</Text>
          </Pressable>
        ) : null
      }
    >
      {/* ── Picker ── */}
      {showExercisePicker && (
        <ExercisePicker
          search={search}
          category={category}
          exercises={filteredExercises}
          loading={exercisesLoading}
          onSearchChange={onSearchChange}
          onPick={onPickExercise}
          onCancel={onClosePicker}
        />
      )}

      {/* ── Config Form ── */}
      {showExerciseForm && selectedExercise && (
        <ExerciseForm
          selectedExercise={selectedExercise}
          editingExercise={editingExercise}
          form={exerciseForm}
          loading={exerciseLoading}
          onChange={onExerciseFormChange}
          onSave={onSaveExercise}
          onCancel={onCancelExerciseForm}
          onChangeExercise={onChangeExercise}
        />
      )}

      {/* ── Empty ── */}
      {exercises.length === 0 && !showExercisePicker && !showExerciseForm && (
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

      {/* ── List ── */}
      {exercises.map((te, i) => (
        <View
          key={te.id}
          className={`flex-row items-center py-3 ${i < exercises.length - 1 ? "border-b border-slate-100" : ""}`}
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
              {te.default_sets}×{te.default_reps} · {te.default_weight}lbs ·{" "}
              {te.default_rest}s rest
            </Text>
          </View>
          <Pressable
            onPress={() => onEditExercise(te)}
            className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 items-center justify-center ml-1"
          >
            <Feather name="edit-2" size={12} color="#94a3b8" />
          </Pressable>
          <Pressable
            onPress={() => onDeleteExercise(te)}
            className="w-8 h-8 rounded-xl bg-red-50 border border-red-100 items-center justify-center ml-1"
          >
            <Feather name="trash-2" size={12} color="#ef4444" />
          </Pressable>
        </View>
      ))}
    </Section>
  );
}

function ExercisePicker({
  search,
  category,
  exercises,
  loading,
  onSearchChange,
  onPick,
  onCancel,
}: {
  search: string;
  category: string;
  exercises: Exercise[];
  loading: boolean;
  onSearchChange: (v: string) => void;
  onPick: (ex: Exercise) => void;
  onCancel: () => void;
}) {
  return (
    <View className="mb-3">
      {/* Search bar */}
      <View className="flex-row items-center border border-slate-200 rounded-xl px-3 py-2 bg-white mb-2">
        <Feather name="search" size={14} color="#94a3b8" />
        <TextInput
          value={search}
          onChangeText={onSearchChange}
          placeholder={`Search ${category.replace("_", " ")} exercises...`}
          placeholderTextColor="#cbd5e1"
          className="flex-1 text-slate-800 text-sm ml-2"
          style={{ padding: 0 }}
        />
        {search.length > 0 && (
          <Pressable onPress={() => onSearchChange("")}>
            <Feather name="x" size={14} color="#94a3b8" />
          </Pressable>
        )}
      </View>

      {/* Badge */}
      <View className="flex-row items-center mb-2">
        <View className="bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full">
          <Text className="text-[10px] font-bold text-orange-500 capitalize">
            {category.replace("_", " ")} · {exercises.length} exercises
          </Text>
        </View>
      </View>

      {/* List */}
      {loading ? (
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
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
            {exercises.length === 0 ? (
              <View className="py-6 items-center">
                <Text className="text-sm text-slate-400">
                  No exercises found
                </Text>
              </View>
            ) : (
              exercises.map((ex, i) => (
                <Pressable
                  key={ex.id}
                  onPress={() => onPick(ex)}
                  className={`flex-row items-center px-3 py-3 ${
                    i < exercises.length - 1 ? "border-b border-slate-50" : ""
                  }`}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
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
                        color: DIFFICULTY_COLOR[ex.difficulty] ?? "#64748b",
                      }}
                    >
                      {ex.difficulty}
                    </Text>
                  </View>
                </Pressable>
              ))
            )}
          </ScrollView>
        </View>
      )}

      {/* Cancel */}
      <Pressable
        onPress={onCancel}
        className="mt-2 py-2.5 rounded-xl bg-slate-100 items-center"
      >
        <Text className="text-slate-500 font-semibold text-sm">Cancel</Text>
      </Pressable>
    </View>
  );
}

/* ── ExerciseForm ── */
function ExerciseForm({
  selectedExercise,
  editingExercise,
  form,
  loading,
  onChange,
  onSave,
  onCancel,
  onChangeExercise,
}: {
  selectedExercise: Exercise;
  editingExercise: TemplateExercise | null;
  form: {
    default_sets: string;
    default_reps: string;
    default_weight: string;
    default_rest: string;
    notes: string;
  };
  loading: boolean;
  onChange: (key: string, val: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onChangeExercise: () => void;
}) {
  return (
    <View
      className="rounded-2xl p-4 mb-3"
      style={{
        borderWidth: 1,
        borderColor: "#fed7aa",
        backgroundColor: "#fff7ed",
      }}
    >
      <View
        className="flex-row items-center mb-4 pb-3"
        style={{ borderBottomWidth: 1, borderBottomColor: "#ffedd5" }}
      >
        <View className="w-9 h-9 rounded-xl bg-orange-100 items-center justify-center mr-3">
          <Ionicons name="barbell-outline" size={16} color="#f97316" />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-black text-slate-800">
            {selectedExercise.name}
          </Text>
          <Text className="text-xs text-slate-400 capitalize mt-0.5">
            {selectedExercise.muscle_group} · {selectedExercise.equipment}
          </Text>
        </View>
        {!editingExercise && (
          <Pressable onPress={onChangeExercise}>
            <Text className="text-xs text-orange-500 font-bold">Change</Text>
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
            value={form.default_sets}
            onChange={(v) => onChange("default_sets", v)}
            keyboard="numeric"
          />
        </View>
        <View className="flex-1">
          <IconInput
            fieldKey="default_reps"
            label="Reps"
            value={form.default_reps}
            onChange={(v) => onChange("default_reps", v)}
            keyboard="numeric"
          />
        </View>
      </View>

      <View className="flex-row gap-x-3">
        <View className="flex-1">
          <IconInput
            fieldKey="default_weight"
            label="Weight"
            value={form.default_weight}
            onChange={(v) => onChange("default_weight", v)}
            keyboard="numeric"
            unit="lbs"
          />
        </View>
        <View className="flex-1">
          <IconInput
            fieldKey="default_rest"
            label="Rest"
            value={form.default_rest}
            onChange={(v) => onChange("default_rest", v)}
            keyboard="numeric"
            unit="sec"
          />
        </View>
      </View>

      <IconInput
        fieldKey="notes"
        label="Notes"
        value={form.notes}
        onChange={(v) => onChange("notes", v)}
        placeholder="Optional cues"
      />

      <View className="flex-row gap-x-2 mt-1">
        <Pressable
          onPress={onCancel}
          className="flex-1 py-2.5 rounded-xl bg-white border border-slate-200 items-center"
        >
          <Text className="text-slate-500 font-semibold text-sm">Cancel</Text>
        </Pressable>
        <Pressable
          onPress={onSave}
          disabled={loading}
          className="flex-[2] py-2.5 rounded-xl bg-orange-500 items-center"
        >
          <Text className="text-white font-bold text-sm">
            {loading
              ? "Saving..."
              : editingExercise
                ? "Update"
                : "Add Exercise"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
