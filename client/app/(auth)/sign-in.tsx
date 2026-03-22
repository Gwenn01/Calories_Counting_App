import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
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
import { useToast } from "@/components/ToastProvider";
import { getToken } from "@/utils/token";

export default function SignInScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!username || !password) {
      showToast("Missing Input", "Username and Password! ", "warning");
      return;
    }
    try {
      setLoading(true);
      const res = await loginUser({ username, password });
      const token = res.data.token;
      await saveToken(token);
      const stored = await getToken();
      console.log("TOKEN AFTER SAVE:", stored);
      showToast("Success!", "Welcome Back", "success");
      router.replace("/(tabs)");
    } catch (error: any) {
      console.log("LOGIN ERROR:", error.response?.data || error.message);
      // Network error — backend not reachable
      if (!error.response) {
        showToast(
          "Connection Failed",
          `Cannot reach server: ${error.message}`, // Shows exact error
          "error",
        );
        return;
      }

      // Backend responded but rejected credentials
      if (error.response.status === 400 || error.response.status === 401) {
        showToast("Error", "Invalid Username or Password", "error");
        return;
      }

      // Any other server error
      showToast(
        "Server Error",
        `Status ${error.response.status}: ${error.response.data?.detail || "Something went wrong"}`,
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    //  KeyboardAvoidingView is now the outermost container
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* SafeAreaView is now INSIDE, with flex-1 and no bg conflict */}
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
        <Toast position="top" />
        {loading && <LoadingOverlay text="Login....." />}

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingVertical: 32,
          }}
          showsVerticalScrollIndicator={false}
        >
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            className="bg-white rounded-3xl p-6 border border-slate-100"
          >
            {/* Header */}
            <View className="items-center mb-8">
              <View className="mb-6 shadow-xl shadow-emerald-200">
                <Image
                  source={require("@/assets/image/logo.jpg")}
                  className="w-24 h-24 rounded-3xl"
                  resizeMode="contain"
                />
              </View>
              <Text className="text-3xl font-bold text-slate-900 tracking-tight">
                Welcome Back
              </Text>
              <Text className="text-slate-400 mt-2 text-center text-base font-medium">
                Sign in to continue tracking your calories
              </Text>
            </View>

            {/* Username */}
            <FloatingInput
              label="Username"
              value={username}
              onChange={setUsername}
              leftIcon={<Feather name="at-sign" size={16} color="#64748b" />}
              returnKeyType="next"
              onSubmitEditing={handleSignIn}
              success={username.length > 3}
            />

            {/* Password */}
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

            {/* Button */}
            <Pressable
              onPress={handleSignIn}
              className="bg-emerald-500 rounded-2xl py-4 items-center"
            >
              <Text className="text-white font-extrabold text-base">
                Sign In
              </Text>
            </Pressable>
          </MotiView>

          {/* Create Account */}
          <View className="flex-row items-center justify-center mt-8 gap-x-2">
            <Text className="text-slate-400 font-medium text-sm">
              New here?
            </Text>
            <Pressable
              onPress={() => router.push("/(auth)/sign-up")}
              className="bg-indigo-50 px-4 py-2 rounded-full active:bg-indigo-100"
            >
              <Text className="text-indigo-600 font-bold text-sm">
                Create Account
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
