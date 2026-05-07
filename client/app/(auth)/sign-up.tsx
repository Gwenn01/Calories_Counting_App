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
import { generateBalancedMacros, calculateDailyCalories } from "@/api/macros";
import { createWorkoutProfile } from "@/api/workout";
import LoadingOverlay from "@/components/LoadingOverplay";
import FloatingInput from "@/components/floatingInput";
import TargetInput from "@/components/TargetInput";
import { useToast } from "@/components/ToastProvider";
import { loginUser } from "@/api/auth";
import { saveToken } from "@/utils/token";

type FitnessProfile = {
  weight_unit: "kg" | "lbs";
  default_rest_time: number;
  experience_level: "beginner" | "intermediate" | "advanced";
  progression_type: "linear" | "double" | "percentage" | "rpe";
  progression_increment_kg: number;
  progression_increment_lbs: number;
};

const FIELD_META: Record<
  string,
  { icon: string; color: string; bg: string; border: string }
> = {
  default_rest_time: {
    icon: "clock",
    color: "#f97316",
    bg: "#fff7ed",
    border: "#ffedd5",
  },
  progression_increment_kg: {
    icon: "activity",
    color: "#ec4899",
    bg: "#fdf2f8",
    border: "#fce7f3",
  },
  progression_increment_lbs: {
    icon: "activity",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fef3c7",
  },
};

export default function SignUpScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const { showToast } = useToast();

  // Step 1 — account + body
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [activityLevel, setActivityLevel] = useState("light");
  const [goal, setGoal] = useState("maintain");
  const [targetCalories, setTargetCalories] = useState("");
  const [targetProtein, setTargetProtein] = useState("");
  const [targetCarbs, setTargetCarbs] = useState("");
  const [targetFats, setTargetFats] = useState("");

  // Step 2 — workout profile
  const [workoutForm, setWorkoutForm] = useState<FitnessProfile>({
    weight_unit: "kg",
    default_rest_time: 90,
    experience_level: "beginner",
    progression_type: "double",
    progression_increment_kg: 2.5,
    progression_increment_lbs: 5.0,
  });

  const handleWorkoutChange = (
    key: keyof FitnessProfile,
    value: string | number,
  ) => {
    setWorkoutForm((prev) => ({ ...prev, [key]: value }) as FitnessProfile);
  };

  // ── Helpers ──────────────────────────────────────────────
  const onGenerateMacros = async () => {
    if (!targetCalories) {
      showToast("Missing Input", "Please enter calories first! ⚡️", "warning");
      return;
    }
    try {
      setLoading(true);
      const res = await generateBalancedMacros(Number(targetCalories));
      setTargetProtein(String(res.data.protein_g));
      setTargetCarbs(String(res.data.carbs_g));
      setTargetFats(String(res.data.fat_g));
      showToast("Success!", "Macros calculated perfectly.", "success");
    } catch {
      showToast("Error", "Could not connect to server.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateCalories = async () => {
    try {
      setLoading(true);
      const res = await calculateDailyCalories({
        weight: Number(weight),
        height: Number(height),
        age: Number(age),
        gender,
        activity_level: activityLevel,
        goal,
      });
      setTargetCalories(String(res.data.daily_calories));
    } catch {
    } finally {
      setLoading(false);
    }
  };

  // ── Step 1 → Step 2 ──────────────────────────────────────
  const handleNextStep = () => {
    if (!username || !password || !name) {
      showToast(
        "Missing Input",
        "Username, password and name are required.",
        "warning",
      );
      return;
    }
    setStep(2);
  };

  // ── Final submit ─────────────────────────────────────────
  const handleSignUp = async () => {
    const payload = {
      username,
      password,
      name,
      age: age ? Number(age) : null,
      weight: weight ? Number(weight) : null,
      height: height ? Number(height) : null,
      gender,
      activity_level: activityLevel,
      goal,
      target_calories: targetCalories
        ? Math.round(Number(targetCalories))
        : null,
      target_protein: targetProtein ? Number(targetProtein) : null,
      target_carbs: targetCarbs ? Number(targetCarbs) : null,
      target_fats: targetFats ? Number(targetFats) : null,
    };

    try {
      setLoading(true);

      // 1. Register user
      await registerUser(payload);

      // 2. Log in to get token so workout profile POST is authenticated
      const loginRes = await loginUser({ username, password });
      await saveToken(loginRes.data.token ?? loginRes.data.access);

      // 3. Create workout profile
      await createWorkoutProfile(workoutForm);

      showToast("Success!", "Account Created Successfully.", "success");
      router.replace("/(auth)/sign-in");
    } catch (error: any) {
      console.log("SERVER ERROR:", error.response?.data);
      showToast("Error", "Could not connect to server.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-slate-50 relative">
      <Toast />
      {loading && (
        <LoadingOverlay
          text={step === 1 ? "Creating account..." : "Setting up profile..."}
        />
      )}

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
          {/* ── HEADER ── */}
          <View className="items-center mb-8">
            <View className="mb-6 shadow-lg shadow-emerald-200 bg-white rounded-3xl">
              <Image
                source={require("@/assets/image/logo.jpg")}
                className="w-24 h-24 rounded-3xl"
                resizeMode="contain"
              />
            </View>
            <Text className="text-3xl font-bold text-slate-900 tracking-tight">
              {step === 1 ? "Create Account" : "Workout Profile"}
            </Text>
            <Text className="text-slate-500 mt-2 text-base font-medium">
              {step === 1
                ? "Set up your nutrition profile"
                : "Customize your training config"}
            </Text>

            {/* Step indicator */}
            <View className="flex-row items-center gap-2 mt-4">
              <View className="w-8 h-1.5 rounded-full bg-emerald-500" />
              <View
                className={`w-8 h-1.5 rounded-full ${step === 2 ? "bg-emerald-500" : "bg-slate-200"}`}
              />
            </View>
          </View>

          {/* ════════════════ STEP 1 ════════════════ */}
          {step === 1 && (
            <>
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
                secure={!showPassword}
                leftIcon={<Feather name="lock" size={18} color="#64748b" />}
                rightIcon={
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={18}
                    color="#64748b"
                  />
                }
                onRightPress={() => setShowPassword(!showPassword)}
                error={
                  password.length > 0 && password.length < 6
                    ? "Password too short"
                    : ""
                }
                returnKeyType="done"
              />

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

              <FloatingInput
                label="Male/Female"
                value={gender}
                onChange={setGender}
                leftIcon={<Feather name="arrow-up" size={18} color="#64748b" />}
              />

              <FloatingInput
                label="Activity Level"
                value={activityLevel}
                onChange={setActivityLevel}
                leftIcon={<Feather name="arrow-up" size={18} color="#64748b" />}
              />

              <FloatingInput
                label="Loss / Maintain / Gain"
                value={goal}
                onChange={setGoal}
                leftIcon={<Feather name="arrow-up" size={18} color="#64748b" />}
              />

              <TouchableOpacity
                onPress={handleCalculateCalories}
                activeOpacity={0.8}
                className="my-5 flex-row items-center justify-center rounded-2xl bg-emerald-900 py-4 shadow-lg shadow-indigo-200"
              >
                <View className="mr-2 rounded-full bg-white/20 p-1.5">
                  <Feather name="zap" size={16} color="white" />
                </View>
                <Text className="text-sm font-bold tracking-wide text-white">
                  Generate Calories
                </Text>
              </TouchableOpacity>

              <View className="mt-2 mb-3">
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
                onPress={onGenerateMacros}
                activeOpacity={0.8}
                className="my-5 flex-row items-center justify-center rounded-2xl bg-indigo-600 py-4 shadow-lg shadow-indigo-200"
              >
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

              <Pressable
                onPress={handleNextStep}
                className="bg-emerald-500 rounded-2xl py-4 items-center mt-6"
              >
                <Text className="text-white font-extrabold text-base">
                  Next →
                </Text>
              </Pressable>
            </>
          )}

          {/* ════════════════ STEP 2 ════════════════ */}
          {step === 2 && (
            <>
              {/* ── Preferences ── */}
              <View
                className="rounded-[20px] p-4 mb-4"
                style={{
                  borderWidth: 1,
                  borderColor: "#f1f5f9",
                  backgroundColor: "#f8fafc",
                }}
              >
                <Text className="text-[10px] font-bold tracking-widest text-slate-300 uppercase mb-3">
                  Preferences
                </Text>

                <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">
                  Weight Unit
                </Text>
                <View className="flex-row mb-4">
                  {(["kg", "lbs"] as const).map((unit, i) => (
                    <Pressable
                      key={unit}
                      onPress={() => handleWorkoutChange("weight_unit", unit)}
                      className={`flex-1 py-3 rounded-xl border items-center ${i === 0 ? "mr-2" : ""} ${
                        workoutForm.weight_unit === unit
                          ? "bg-emerald-50 border-emerald-400"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      <Text
                        className={`font-bold text-sm ${
                          workoutForm.weight_unit === unit
                            ? "text-emerald-600"
                            : "text-slate-400"
                        }`}
                      >
                        {unit.toUpperCase()}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <IconInput
                  fieldKey="default_rest_time"
                  label="Default Rest Time"
                  value={String(workoutForm.default_rest_time)}
                  unit="sec"
                  keyboard="numeric"
                  onChange={(v) =>
                    handleWorkoutChange("default_rest_time", Number(v) || 0)
                  }
                />
              </View>

              {/* ── Training Config ── */}
              <View
                className="rounded-[20px] p-4 mb-4"
                style={{
                  borderWidth: 1,
                  borderColor: "#f1f5f9",
                  backgroundColor: "#f8fafc",
                }}
              >
                <Text className="text-[10px] font-bold tracking-widest text-slate-300 uppercase mb-3">
                  Training Config
                </Text>

                <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">
                  Experience Level
                </Text>
                <View className="flex-row mb-4">
                  {(["beginner", "intermediate", "advanced"] as const).map(
                    (level, i) => (
                      <Pressable
                        key={level}
                        onPress={() =>
                          handleWorkoutChange("experience_level", level)
                        }
                        className={`flex-1 py-3 rounded-xl border items-center ${i < 2 ? "mr-2" : ""} ${
                          workoutForm.experience_level === level
                            ? "bg-emerald-50 border-emerald-400"
                            : "bg-white border-slate-200"
                        }`}
                      >
                        <Text
                          className={`font-bold text-xs ${
                            workoutForm.experience_level === level
                              ? "text-emerald-600"
                              : "text-slate-400"
                          }`}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </Text>
                      </Pressable>
                    ),
                  )}
                </View>

                <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">
                  Progression Type
                </Text>
                <View className="flex-row flex-wrap mb-1">
                  {(["linear", "double", "percentage", "rpe"] as const).map(
                    (type, i) => (
                      <Pressable
                        key={type}
                        onPress={() =>
                          handleWorkoutChange("progression_type", type)
                        }
                        className={`py-3 px-4 rounded-xl border items-center mb-2 ${i % 2 === 0 ? "mr-2" : ""} ${
                          workoutForm.progression_type === type
                            ? "bg-emerald-50 border-emerald-400"
                            : "bg-white border-slate-200"
                        }`}
                      >
                        <Text
                          className={`font-bold text-xs ${
                            workoutForm.progression_type === type
                              ? "text-emerald-600"
                              : "text-slate-400"
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Text>
                      </Pressable>
                    ),
                  )}
                </View>
              </View>

              {/* ── Progression Increments ── */}
              <View
                className="rounded-[20px] p-4 mb-4"
                style={{
                  borderWidth: 1,
                  borderColor: "#f1f5f9",
                  backgroundColor: "#f8fafc",
                }}
              >
                <Text className="text-[10px] font-bold tracking-widest text-slate-300 uppercase mb-3">
                  Progression Increments
                </Text>
                <IconInput
                  fieldKey="progression_increment_kg"
                  label="Increment (kg)"
                  value={String(workoutForm.progression_increment_kg)}
                  unit="kg"
                  keyboard="numeric"
                  onChange={(v) =>
                    handleWorkoutChange(
                      "progression_increment_kg",
                      Number(v) || 0,
                    )
                  }
                />
                <IconInput
                  fieldKey="progression_increment_lbs"
                  label="Increment (lbs)"
                  value={String(workoutForm.progression_increment_lbs)}
                  unit="lbs"
                  keyboard="numeric"
                  onChange={(v) =>
                    handleWorkoutChange(
                      "progression_increment_lbs",
                      Number(v) || 0,
                    )
                  }
                />
              </View>

              {/* Buttons */}
              <View className="flex-row gap-3 mt-2">
                <Pressable
                  onPress={() => setStep(1)}
                  className="flex-1 py-4 rounded-2xl bg-slate-100 items-center"
                >
                  <Text className="font-semibold text-slate-500">← Back</Text>
                </Pressable>
                <Pressable
                  onPress={handleSignUp}
                  className="flex-[2] py-4 rounded-2xl bg-emerald-500 items-center"
                >
                  <Text className="text-white font-extrabold text-base">
                    Create Account
                  </Text>
                </Pressable>
              </View>
            </>
          )}

          {/* Sign in link — only on step 1 */}
          {step === 1 && (
            <View className="flex-row items-center justify-center mt-6 gap-x-2">
              <Text className="text-slate-400 text-sm font-medium">
                Member already?
              </Text>
              <Pressable
                onPress={() => router.push("/sign-in")}
                className="bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 active:bg-emerald-100"
              >
                <Text className="text-emerald-600 text-sm font-bold">
                  Log In
                </Text>
              </Pressable>
            </View>
          )}
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ── IconInput ── */
function IconInput({
  fieldKey,
  label,
  value,
  unit,
  onChange,
  keyboard = "default",
}: {
  fieldKey: string;
  label: string;
  value: string;
  unit?: string;
  onChange: (v: string) => void;
  keyboard?: string;
}) {
  const meta = FIELD_META[fieldKey] ?? {
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
