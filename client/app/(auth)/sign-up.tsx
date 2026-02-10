import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { MotiView } from "moti";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { registerUser } from "@/api/auth";
import { generateBalancedMacros } from "@/api/macros";
import LoadingOverlay from "@/components/LoadingOverplay";
import FloatingInput from "@/components/floatingInput";
import TargetInput from "@/components/TargetInput";
import { useToast } from "@/components/ToastProvider";

export default function SignUpScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();

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

  const onGenerateMacros = async () => {
    if (!targetCalories) {
      showToast("Missing Input", "Please enter calories first! ⚡️", "warning");
      return;
    }

    try {
      setLoading(true);
      // 1. Convert input string to number for the API
      const calories = Number(targetCalories);

      // 2. Call your API
      const res = await generateBalancedMacros(calories);

      // 3. Update state (Convert back to String for the Inputs!)
      // Assuming res.data returns numbers like 150, 200, etc.
      setTargetProtein(String(res.data.protein));
      setTargetCarbs(String(res.data.carbs));
      setTargetFats(String(res.data.fats));
      showToast("Success!", "Macros calculated perfectly.", "success");
    } catch (err) {
      showToast("Error", "Could not connect to server.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!username || !password || !name) {
      showToast("Missing Input", "Username and Password! ⚡️", "warning");
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

      showToast("Success!", "Account Created Successfully.", "success");

      router.replace("/(auth)/sign-in");
    } catch (error: any) {
      showToast("Error", "Could not connect to server.", "error");
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
          <View className="items-center mb-8">
            {/* Logo with Glow Effect */}
            <View className="mb-6 shadow-lg shadow-emerald-200 bg-white rounded-3xl">
              <Image
                source={require("@/assets/image/logo.jpg")}
                className="w-24 h-24 rounded-3xl"
                resizeMode="contain"
              />
            </View>

            {/* Modern Typography */}
            <Text className="text-3xl font-bold text-slate-900 tracking-tight">
              Create Account
            </Text>

            <Text className="text-slate-500 mt-2 text-base font-medium">
              Set up your nutrition profile
            </Text>
          </View>

          {/* ---------- AUTH ---------- */}
          <FloatingInput
            label="Username"
            value={username}
            onChange={setUsername}
            leftIcon={<Feather name="at-sign" size={18} color="#64748b" />}
            returnKeyType="next"
          />

          <FloatingInput
            label="Password"
            value={password}
            onChange={setPassword}
            secure
            leftIcon={<Feather name="lock" size={18} color="#64748b" />}
            rightIcon={
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={18}
                color="#64748b"
              />
            }
            onRightPress={() => setShowPassword(!showPassword)}
            returnKeyType="done"
          />

          {/* ---------- PROFILE ---------- */}
          <FloatingInput
            label="Full Name"
            value={name}
            onChange={setName}
            leftIcon={<Feather name="user" size={18} color="#64748b" />}
          />

          <FloatingInput
            label="Age"
            value={age}
            onChange={setAge}
            isNumeric
            leftIcon={<Feather name="calendar" size={18} color="#64748b" />}
          />

          <FloatingInput
            label="Weight (kg)"
            value={weight}
            onChange={setWeight}
            isNumeric
            leftIcon={<Feather name="activity" size={18} color="#64748b" />}
          />

          <FloatingInput
            label="Height (cm)"
            value={height}
            onChange={setHeight}
            isNumeric
            leftIcon={<Feather name="arrow-up" size={18} color="#64748b" />}
          />

          {/* ---------- TARGETS ---------- */}
          <View className="mt-6 mb-3">
            <Text className="text-xs font-bold tracking-wide text-slate-400">
              DAILY TARGETS
            </Text>
          </View>

          <TargetInput
            label="Target Calories"
            value={targetCalories}
            onChange={setTargetCalories}
            icon="zap"
            color="#f59e0b"
          />

          <TouchableOpacity
            // FIX: Wrap in arrow function and convert string state to number
            onPress={onGenerateMacros}
            activeOpacity={0.8}
            className="my-5 flex-row items-center justify-center rounded-2xl bg-indigo-600 py-4 shadow-lg shadow-indigo-200"
          >
            {/* Glowing Icon Container */}
            <View className="mr-2 rounded-full bg-white/20 p-1.5">
              <Feather name="zap" size={16} color="white" />
            </View>

            <Text className="text-sm font-bold tracking-wide text-white">
              Auto-Balance Macros
            </Text>
          </TouchableOpacity>

          <TargetInput
            label="Target Protein (g)"
            value={targetProtein}
            onChange={setTargetProtein}
            icon="dribbble"
            color="#ef4444"
          />

          <TargetInput
            label="Target Carbs (g)"
            value={targetCarbs}
            onChange={setTargetCarbs}
            icon="layers"
            color="#3b82f6"
          />

          <TargetInput
            label="Target Fats (g)"
            value={targetFats}
            onChange={setTargetFats}
            icon="droplet"
            color="#a855f7"
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
          <View className="flex-row items-center justify-center mt-6 gap-x-2">
            <Text className="text-slate-400 text-sm font-medium">
              Member already?
            </Text>

            <Pressable
              onPress={() => router.push("/sign-in")}
              className="bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 active:bg-emerald-100"
            >
              <Text className="text-emerald-600 text-sm font-bold">Log In</Text>
            </Pressable>
          </View>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
}
