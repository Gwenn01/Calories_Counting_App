import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SettingsRow } from "../../components/Profile/SettingsRow";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useAlert } from "@/components/AlertProvider";

export default function ProfileScreen() {
  const router = useRouter();
  const { showAlert } = useAlert();

  const handleSignOut = () => {
    showAlert("Sign Out", "Are you sure you want to log out of your account?", [
      {
        text: "Cancel",
        style: "cancel",
        // No onPress needed, it closes automatically
      },
      {
        text: "Yes, Sign Out",
        style: "destructive", // Triggers the Red styling
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          router.replace("/(auth)/sign-in");
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="p-6"
        contentContainerStyle={{ paddingBottom: 120 }} // space for tabs
        showsVerticalScrollIndicator={false}
      >
        {/* ---------- HEADER ---------- */}
        <View className="items-center mb-8">
          <View className="w-[72px] h-[72px] rounded-full bg-slate-900 items-center justify-center mb-3">
            <Text className="text-white text-2xl font-black">JD</Text>
          </View>

          <Text className="text-[22px] font-extrabold text-slate-900">
            John Doe
          </Text>
          <Text className="text-sm text-slate-500 mt-1">Fitness Tracking</Text>
        </View>

        {/* ---------- GOAL CARD ---------- */}
        <View className="bg-slate-900 rounded-[28px] p-6 mb-6">
          <Text className="text-xs font-bold tracking-widest text-slate-400 uppercase">
            DAILY CALORIE GOAL
          </Text>

          <Text className="text-4xl font-black text-white mt-1.5">
            2000 kcal
          </Text>
        </View>

        {/* ---------- SETTINGS ---------- */}
        <View className="bg-white rounded-[28px] overflow-hidden shadow-sm mb-8">
          <SettingsRow icon="edit-3" label="Edit calorie goal" />
          <SettingsRow icon="trending-up" label="Update weight" />
          <SettingsRow icon="info" label="About this app" />
        </View>

        {/* ---------- SIGN OUT ---------- */}
        <Pressable
          onPress={handleSignOut}
          className="flex-row items-center justify-center gap-3 py-4 rounded-2xl bg-red-50 border border-red-200"
        >
          <Feather name="log-out" size={20} color="#ef4444" />
          <Text className="text-red-600 font-semibold text-base">Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
