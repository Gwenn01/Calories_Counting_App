import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { MotiView } from "moti";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { registerUser } from "@/api/auth";
import LoadingOverlay from "@/components/LoadingOverplay";

export default function SignUpScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const [targetCalories, setTargetCalories] = useState("");
  const [targetProtein, setTargetProtein] = useState("");
  const [targetCarbs, setTargetCarbs] = useState("");
  const [targetFats, setTargetFats] = useState("");

  const handleSignUp = async () => {
    if (!username || !password || !name) {
      Alert.alert("Missing fields", "Username, password and name are required");
      return;
    }

    const payload = {
      username,
      password,
      name,
      age: age ? Number(age) : null,
      weight: weight ? Number(weight) : null,
      height: height ? Number(height) : null,
      target_calories: targetCalories ? Number(targetCalories) : null,
      target_protein: targetProtein ? Number(targetProtein) : null,
      target_carbs: targetCarbs ? Number(targetCarbs) : null,
      target_fats: targetFats ? Number(targetFats) : null,
    };

    try {
      setLoading(true);

      await registerUser(payload);

      Toast.show({
        type: "success",
        text1: "Account created",
        text2: "Please login to continue",
      });

      router.replace("/(auth)/sign-in");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Registration failed",
        text2: error?.response?.data?.detail || "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 relative">
      {/* GLOBAL TOAST */}
      <Toast />

      {/* GLOBAL LOADING */}
      {loading && <LoadingOverlay text="Creating account..." />}
      <ScrollView
        className="px-6"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          className="bg-white rounded-3xl p-6 border border-slate-100 mt-6"
        >
          {/* ---------- HEADER ---------- */}
          <View className="items-center mb-6">
            <View className="bg-emerald-100 p-3 rounded-2xl mb-3">
              <Feather name="user-plus" size={24} color="#10b981" />
            </View>
            <Text className="text-2xl font-black text-slate-900">
              Create Account
            </Text>
            <Text className="text-slate-400 mt-1">
              Set up your nutrition profile
            </Text>
          </View>

          {/* ---------- AUTH ---------- */}
          <Input label="Username" value={username} onChange={setUsername} />
          <Input
            label="Password"
            value={password}
            onChange={setPassword}
            secure
          />

          {/* ---------- PROFILE ---------- */}
          <Input label="Full Name" value={name} onChange={setName} />
          <Input label="Age" value={age} onChange={setAge} number />
          <Input
            label="Weight (kg)"
            value={weight}
            onChange={setWeight}
            number
          />
          <Input
            label="Height (cm)"
            value={height}
            onChange={setHeight}
            number
          />

          {/* ---------- TARGETS ---------- */}
          <View className="mt-4 mb-2">
            <Text className="text-xs font-bold tracking-wide text-slate-400">
              DAILY TARGETS
            </Text>
          </View>

          <Input
            label="Target Calories"
            value={targetCalories}
            onChange={setTargetCalories}
            number
          />
          <Input
            label="Target Protein (g)"
            value={targetProtein}
            onChange={setTargetProtein}
            number
          />
          <Input
            label="Target Carbs (g)"
            value={targetCarbs}
            onChange={setTargetCarbs}
            number
          />
          <Input
            label="Target Fats (g)"
            value={targetFats}
            onChange={setTargetFats}
            number
          />

          {/* ---------- BUTTON ---------- */}
          <Pressable
            onPress={handleSignUp}
            className="bg-emerald-500 rounded-2xl py-4 items-center mt-6"
          >
            <Text className="text-white font-extrabold text-base">
              Create Account
            </Text>
          </Pressable>
          <View className="flex-row items-center justify-center mt-4">
            <Text className="text-gray-400 text-sm">
              Already have an account?
            </Text>
            <Pressable onPress={() => router.push("/sign-in")}>
              <Text className="text-emerald-500 text-sm ml-1">Sign In</Text>
            </Pressable>
          </View>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- REUSABLE INPUT ---------------- */
function Input({
  label,
  value,
  onChange,
  secure = false,
  number = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  secure?: boolean;
  number?: boolean;
}) {
  return (
    <View className="mb-4">
      <Text className="text-xs font-bold tracking-wide text-slate-400 mb-2">
        {label.toUpperCase()}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        secureTextEntry={secure}
        keyboardType={number ? "numeric" : "default"}
        className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900"
      />
    </View>
  );
}
