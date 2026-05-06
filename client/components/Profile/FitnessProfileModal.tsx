import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Scale,
  Timer,
  Zap,
  TrendingUp,
  Dumbbell,
  Settings2,
} from "lucide-react-native";

type FitnessProfile = {
  weight_unit: "kg" | "lbs";
  default_rest_time: number;
  experience_level: "beginner" | "intermediate" | "advanced";
  progression_type: "linear" | "double" | "percentage" | "rpe";
  progression_increment_kg: number;
  progression_increment_lbs: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FitnessProfile) => void;
  initialData?: FitnessProfile | null;
};

export default function FitnessProfileModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}: Props) {
  const [form, setForm] = useState<FitnessProfile>({
    weight_unit: "kg",
    default_rest_time: 90,
    experience_level: "beginner",
    progression_type: "double",
    progression_increment_kg: 2.5,
    progression_increment_lbs: 5.0,
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (name: keyof FitnessProfile, value: string | number) => {
    setForm({
      ...form,
      [name]: value,
    } as FitnessProfile);
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <Modal visible={isOpen} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/40">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View className="bg-white rounded-t-[40px] p-6 pb-10 shadow-2xl">
            {/* Grabber Handle */}
            <View className="items-center mb-6">
              <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              className="max-h-[85vh]"
            >
              {/* Header section with Icon (Replaced gap with mr-3) */}
              <View className="flex-row items-center mb-2">
                <View className="bg-green-100 p-2.5 rounded-xl mr-3">
                  <Settings2 size={24} color="#16a34a" />
                </View>
                <View>
                  <Text className="text-2xl font-bold text-gray-900">
                    {initialData ? "Edit Profile" : "Create Profile"}
                  </Text>
                </View>
              </View>
              <Text className="text-gray-400 mb-8 ml-1">
                Optimize your workout tracking experience.
              </Text>

              {/* Weight Unit Selection */}
              <Label
                text="Weight Unit"
                icon={<Scale size={16} color="#9ca3af" />}
              />
              {/* Replaced gap-3 and map array with explicit margins for safety */}
              <View className="flex-row justify-between mb-6">
                <SelectChip
                  label="KG"
                  isSelected={form.weight_unit === "kg"}
                  onPress={() => handleChange("weight_unit", "kg")}
                  extraClass="mr-1.5"
                />
                <SelectChip
                  label="LBS"
                  isSelected={form.weight_unit === "lbs"}
                  onPress={() => handleChange("weight_unit", "lbs")}
                  extraClass="ml-1.5"
                />
              </View>

              {/* Numeric Inputs Grid */}
              <View className="flex-row justify-between mb-6">
                <View className="w-[48%]">
                  <Label
                    text="Rest (sec)"
                    icon={<Timer size={16} color="#9ca3af" />}
                  />
                  <StyledInput
                    value={String(form.default_rest_time)}
                    keyboardType="numeric"
                    onChangeText={(v: string) =>
                      handleChange("default_rest_time", Number(v))
                    }
                  />
                </View>
                <View className="w-[48%]">
                  <Label
                    text="Exp. Level"
                    icon={<Zap size={16} color="#9ca3af" />}
                  />
                  <StyledInput
                    value={capitalize(form.experience_level)}
                    onChangeText={(v: string) =>
                      handleChange("experience_level", v.toLowerCase())
                    }
                  />
                </View>
              </View>

              <Label
                text="Progression Method"
                icon={<TrendingUp size={16} color="#9ca3af" />}
              />
              <StyledInput
                value={capitalize(form.progression_type)}
                onChangeText={(v: string) =>
                  handleChange("progression_type", v.toLowerCase())
                }
              />

              <View className="flex-row justify-between mb-8 mt-6">
                <View className="w-[48%]">
                  <Label
                    text="Inc (KG)"
                    icon={<Dumbbell size={16} color="#9ca3af" />}
                  />
                  <StyledInput
                    value={String(form.progression_increment_kg)}
                    keyboardType="numeric"
                    onChangeText={(v: string) =>
                      handleChange("progression_increment_kg", Number(v))
                    }
                  />
                </View>
                <View className="w-[48%]">
                  <Label
                    text="Inc (LBS)"
                    icon={<Dumbbell size={16} color="#9ca3af" />}
                  />
                  <StyledInput
                    value={String(form.progression_increment_lbs)}
                    keyboardType="numeric"
                    onChangeText={(v: string) =>
                      handleChange("progression_increment_lbs", Number(v))
                    }
                  />
                </View>
              </View>

              {/* Action Buttons (Replaced gap-4 with mr-2 and ml-2) */}
              <View className="flex-row">
                <TouchableOpacity
                  onPress={onClose}
                  className="flex-1 bg-gray-100 py-4 rounded-2xl items-center mr-2"
                >
                  <Text className="text-gray-600 font-semibold text-lg">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSubmit}
                  className="flex-[2] bg-green-500 py-4 rounded-2xl items-center shadow-lg shadow-green-200 ml-2"
                >
                  <Text className="text-white font-bold text-lg">
                    {initialData ? "Save Changes" : "Get Started"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

// Internal Styled Sub-components

// Wrapped {icon} in a View and used mr-1.5 instead of gap
const Label = ({ text, icon }: { text: string; icon?: React.ReactNode }) => (
  <View className="flex-row items-center mb-2 ml-1">
    {icon && <View className="mr-1.5">{icon}</View>}
    <Text className="text-gray-500 font-bold text-xs uppercase tracking-widest">
      {text}
    </Text>
  </View>
);

const StyledInput = (props: any) => (
  <TextInput
    {...props}
    placeholderTextColor="#9ca3af"
    className="bg-gray-50 border border-gray-100 p-4 rounded-2xl text-gray-900 font-semibold mb-1"
  />
);

// Fixed: Changed border-1 to border, removed static ml-5, added extraClass prop
const SelectChip = ({ label, isSelected, onPress, extraClass = "" }: any) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-1 flex-row justify-center py-3.5 rounded-2xl border items-center ${
      isSelected ? "bg-green-50 border-green-500" : "bg-white border-gray-100"
    } ${extraClass}`}
  >
    <Text
      className={`font-bold ${isSelected ? "text-green-600" : "text-gray-400"}`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
