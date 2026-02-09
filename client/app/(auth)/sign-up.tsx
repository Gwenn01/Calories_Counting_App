import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { MotiView } from "moti";

export default function SignInScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    if (!username || !password) {
      Alert.alert("Missing fields", "Please enter username and password");
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
        <View className="items-center mb-6">
          <View className="bg-emerald-100 p-3 rounded-2xl mb-3">
            <Feather name="user" size={24} color="#10b981" />
          </View>
          <Text className="text-2xl font-black text-slate-900">Sign In</Text>
          <Text className="text-slate-400 mt-1">Welcome back 👋</Text>
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
    </SafeAreaView>
  );
}
