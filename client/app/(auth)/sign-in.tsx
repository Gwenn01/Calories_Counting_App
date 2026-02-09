import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { MotiView } from "moti";
import { loginUser } from "@/api/auth";
import { saveToken } from "@/utils/token";
import Toast from "react-native-toast-message";
import LoadingOverlay from "@/components/LoadingOverplay";
import FloatingInput from "@/components/floatingInput";
export default function SignInScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!username || !password) {
      Alert.alert("Missing fields", "Username and password required");
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser({ username, password });

      const token = res.data.token; // or res.data.token

      await saveToken(token);

      Toast.show({
        type: "success",
        text1: "Welcome back 👋",
      });

      router.replace("/(tabs)"); // go to app
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Login failed",
        text2: "Invalid credentials",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 relative">
      {/* GLOBAL TOAST */}
      <Toast position="top" />

      {/* GLOBAL LOADING */}
      {loading && <LoadingOverlay text="Creating account..." />}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        className="flex-1"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingTop: 80, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          className="px-6"
        >
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            className="bg-white rounded-3xl p-6 border border-slate-100"
          >
            {/* ---------- HEADER ---------- */}
            <View className="items-center mb-8">
              {/* Icon */}
              <View className="bg-emerald-100 p-4 rounded-full mb-4">
                <Feather name="user" size={28} color="#10b981" />
              </View>

              {/* Title */}
              <Text className="text-3xl font-bold text-slate-900">
                Welcome Back
              </Text>

              {/* Subtitle */}
              <Text className="text-slate-400 mt-2 text-center">
                Sign in to continue tracking your calories
              </Text>
            </View>
            {/* ---------- USERNAME ---------- */}
            <FloatingInput
              label="Username"
              value={username}
              onChange={setUsername}
              leftIcon={<Feather name="at-sign" size={16} color="#64748b" />}
              returnKeyType="next"
              onSubmitEditing={handleSignIn}
              success={username.length > 3}
            />

            <FloatingInput
              label="Password"
              value={password}
              onChange={setPassword}
              secure={!showPassword}
              leftIcon={<Feather name="lock" size={16} color="#64748b" />}
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

            {/* ---------- BUTTON ---------- */}
            <Pressable
              onPress={handleSignIn}
              className="bg-emerald-500 rounded-2xl py-4 items-center"
            >
              <Text className="text-white font-extrabold text-base">
                Sign In
              </Text>
            </Pressable>
          </MotiView>
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-500">Don’t have an account? </Text>

            <Pressable
              onPress={() => router.push("/(auth)/sign-up")}
              className="active:opacity-70"
            >
              <Text className="text-blue-600 font-semibold, underline">
                Register
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
