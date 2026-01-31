import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
// import { useMacroStore } from "@/store/macro.store";

export default function AddFoodScreen() {
  const router = useRouter();
  // const addFood = useMacroStore((state) => state.addFood);

  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const handleAdd = () => {
    // Logic for adding food
    /*
    addFood({
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
    });
    */
    router.back(); // Auto go back after adding
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6 pt-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Close */}
          <View className="flex-row justify-between items-center mb-10">
            <View>
              <Text className="text-slate-900 text-3xl font-black">
                Quick Add
              </Text>
              <Text className="text-slate-400 font-medium text-sm">
                Log your meal macros
              </Text>
            </View>
            <Pressable
              onPress={() => router.back()}
              className="bg-slate-100 p-3 rounded-2xl"
            >
              <Feather name="x" size={24} color="#64748b" />
            </Pressable>
          </View>

          {/* Input Fields */}
          <View className="gap-y-6">
            <InputGroup
              label="Total Calories"
              placeholder="0"
              value={calories}
              onChange={setCalories}
              icon="zap"
              color="#10b981"
              unit="kcal"
            />

            <View className="h-[1px] bg-slate-50 w-full" />

            <View className="flex-row gap-4">
              <View className="flex-1">
                <InputGroup
                  label="Protein"
                  placeholder="0"
                  value={protein}
                  onChange={setProtein}
                  icon="shield"
                  color="#10b981"
                  unit="g"
                />
              </View>
              <View className="flex-1">
                <InputGroup
                  label="Carbs"
                  placeholder="0"
                  value={carbs}
                  onChange={setCarbs}
                  icon="droplet"
                  color="#3b82f6"
                  unit="g"
                />
              </View>
            </View>

            <InputGroup
              label="Fat"
              placeholder="0"
              value={fat}
              onChange={setFat}
              icon="circle"
              color="#f59e0b"
              unit="g"
            />
          </View>

          {/* Save Button */}
          <View className="mt-12 mb-10">
            <Pressable
              onPress={handleAdd}
              className="bg-emerald-500 py-5 rounded-[24px] items-center shadow-xl shadow-emerald-200"
              style={({ pressed }) => ({
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <View className="flex-row items-center">
                <Feather name="check" size={20} color="white" />
                <Text className="text-white font-black text-lg ml-2">
                  Log Food
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => router.back()}
              className="mt-6 items-center"
            >
              <Text className="text-slate-400 font-bold">Cancel</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Custom Input Component
function InputGroup({
  label,
  placeholder,
  value,
  onChange,
  icon,
  color,
  unit,
}: any) {
  return (
    <View>
      <View className="flex-row items-center mb-2">
        <Feather name={icon} size={14} color={color} />
        <Text className="text-slate-500 font-bold text-xs uppercase tracking-widest ml-2">
          {label}
        </Text>
      </View>
      <View className="flex-row items-center bg-slate-50 rounded-2xl px-5 py-2 border border-slate-100 focus:border-emerald-500">
        <TextInput
          placeholder={placeholder}
          keyboardType="numeric"
          value={value}
          onChangeText={onChange}
          placeholderTextColor="#cbd5e1"
          className="flex-1 py-3 text-xl font-black text-slate-900"
        />
        <Text className="text-slate-400 font-bold ml-2">{unit}</Text>
      </View>
    </View>
  );
}
