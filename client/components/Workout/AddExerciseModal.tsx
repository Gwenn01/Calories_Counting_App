import { useState, memo } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { EXERCISE_LIBRARY } from "@/constants/workout";

interface AddExerciseModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
}

const AddExerciseModal = memo(function AddExerciseModal({
  visible,
  onClose,
  onAdd,
}: AddExerciseModalProps) {
  const [query, setQuery] = useState("");

  const filtered = EXERCISE_LIBRARY.filter((e) =>
    e.name.toLowerCase().includes(query.toLowerCase()),
  );

  // Group exercises by muscle
  const groups = filtered.reduce<Record<string, typeof EXERCISE_LIBRARY>>(
    (acc, e) => {
      if (!acc[e.muscle]) acc[e.muscle] = [];
      acc[e.muscle].push(e);
      return acc;
    },
    {},
  );

  const handleSelect = (name: string) => {
    onAdd(name);
    onClose();
    setQuery("");
  };

  const handleClose = () => {
    onClose();
    setQuery("");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView className="flex-1 bg-slate-50">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
          <Text className="text-lg font-black text-slate-800">
            Add Exercise
          </Text>
          <Pressable
            onPress={handleClose}
            className="w-9 h-9 rounded-xl bg-slate-100 items-center justify-center"
            hitSlop={8}
          >
            <Ionicons name="close" size={18} color="#475569" />
          </Pressable>
        </View>

        {/* Search bar */}
        <View className="mx-4 mb-4 flex-row items-center bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm gap-x-2">
          <Ionicons name="search-outline" size={16} color="#94a3b8" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search exercises..."
            placeholderTextColor="#94a3b8"
            autoCorrect={false}
            className="flex-1 text-sm font-semibold text-slate-800"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")} hitSlop={8}>
              <Ionicons name="close-circle" size={16} color="#94a3b8" />
            </Pressable>
          )}
        </View>

        {/* Exercise list grouped by muscle */}
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {Object.entries(groups).map(([muscle, exercises]) => (
            <View key={muscle} className="mb-4">
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                {muscle}
              </Text>
              <View className="bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm">
                {exercises.map((ex, idx) => (
                  <Pressable
                    key={ex.name}
                    onPress={() => handleSelect(ex.name)}
                    className={`flex-row items-center justify-between px-4 py-3.5 active:bg-slate-50 ${
                      idx < exercises.length - 1
                        ? "border-b border-slate-50"
                        : ""
                    }`}
                  >
                    <Text className="text-sm font-semibold text-slate-700">
                      {ex.name}
                    </Text>
                    <Ionicons
                      name="add-circle-outline"
                      size={20}
                      color="#f97316"
                    />
                  </Pressable>
                ))}
              </View>
            </View>
          ))}

          {filtered.length === 0 && (
            <View className="items-center py-12">
              <Ionicons name="search-outline" size={28} color="#cbd5e1" />
              <Text className="text-sm text-slate-400 font-medium mt-3">
                No exercises found
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
});

export default AddExerciseModal;
