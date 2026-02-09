import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { MotiView } from "moti";
import Toast from "react-native-toast-message";

export default function SignInScreen() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    if (!username || !password) {
      Toast.show({
        type: "error",
        text1: "Missing fields",
        text2: "Username, password and name are required",
      });
      return;
    }

    // 🔗 Later: connect to backend here
    console.log("Username:", username);
    console.log("Password:", password);

    Alert.alert("Success", "Signed in successfully");
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 justify-center px-6">
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
        <View className="mb-4">
          <Text className="text-xs font-bold tracking-wide text-slate-400 mb-2">
            USERNAME
          </Text>
          <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4">
            <Feather name="at-sign" size={16} color="#64748b" />
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your username"
              autoCapitalize="none"
              className="flex-1 py-3 px-3 text-slate-900"
            />
          </View>
        </View>

        {/* ---------- PASSWORD ---------- */}
        <View className="mb-6">
          <Text className="text-xs font-bold tracking-wide text-slate-400 mb-2">
            PASSWORD
          </Text>
          <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4">
            <Feather name="lock" size={16} color="#64748b" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              className="flex-1 py-3 px-3 text-slate-900"
            />
          </View>
        </View>

        {/* ---------- BUTTON ---------- */}
        <Pressable
          onPress={handleSignIn}
          className="bg-emerald-500 rounded-2xl py-4 items-center"
        >
          <Text className="text-white font-extrabold text-base">Sign In</Text>
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

      <Toast />
    </SafeAreaView>
  );
}
