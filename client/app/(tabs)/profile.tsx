import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
// components
import { useAlert } from "@/components/AlertProvider";
import { useToast } from "@/components/ToastProvider";
import LoadingOverlay from "@/components/LoadingOverplay";
import { SettingsRow } from "../../components/Profile/SettingsRow";
import MacroItem from "@/components/Profile/MacroItem";
import MetricItem from "@/components/Profile/MetricItem";
import EditProfileModal from "@/components/Profile/EditProfileModal";
// token
import { removeToken } from "@/utils/token";
import { Platform } from "react-native";
import { logoutUser } from "@/api/auth";
// apis
import { fetchProfile, editProfile } from "@/api/profile";
import { getStreak } from "@/api/history";

export default function ProfileScreen() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [profile, setProfile] = useState({
    id: 1,
    username_display: "",
    name: "",
    age: 0,
    weight: 0,
    height: 0,
    gender: "",
    activity_level: "",
    goal: "",
    target_calories: 0,
    target_protein: 0,
    target_carbs: 0,
    target_fats: 0,
  });
  const [showEditProfile, setShowEditProfile] = useState(false);
  // streak
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        setLoading(true);
        const res = await getStreak();
        setStreak(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreak();
  }, []);

  // fetch profile data
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const profileData = await fetchProfile();
      setProfile(profileData);
    } catch (err) {
      console.error(err);
      showToast("error", "Error fetching profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);
  // functions
  const handleSaveProfile = async (data: any) => {
    try {
      await editProfile(data); // PUT request
      setProfile(data);
      setShowEditProfile(false);
      showToast("Success!", "Update successful", "success");
    } catch (error) {
      showToast("Error", "Server error", "error");
      console.log("Failed to update profile");
    }
  };

  const handleSignOut = () => {
    showAlert("Sign Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await logoutUser(); // backend logout (token still exists)
            await removeToken();
            router.replace("/(auth)/sign-in");

            showToast("Success!", "Logout successful", "success");
          } catch (e) {
            setLoading(false);
            showToast("Error", "Server error", "error");
            // ignore (token might already be invalid)
          } finally {
            // 2️ Clear local auth
            await removeToken();
            router.replace("/(auth)/sign-in");
            // 3️ Hard reset navigation
            if (Platform.OS === "web") {
              window.location.replace("/(auth)/sign-in");
            } else {
              router.replace("/(auth)/sign-in");
            }
          }
        },
      },
    ]);
  };
  if (!profile) {
    return <LoadingOverlay text="Loading profile..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* GLOBAL LOADING */}
      {loading && <LoadingOverlay text="Creating account..." />}
      <ScrollView
        className="p-6"
        contentContainerStyle={{ paddingBottom: 120 }} // space for tabs
        showsVerticalScrollIndicator={false}
      >
        {/* ---------- HEADER ---------- */}
        <View className="items-center mb-8">
          <View className="w-[80px] h-[80px] rounded-full bg-emerald-500 items-center justify-center mb-3">
            <Text className="text-white text-2xl font-black">
              {profile.name
                ?.split(" ")
                .map((n: string) => n[0])
                .join("")
                .slice(0, 2)}
            </Text>
          </View>

          <Text className="text-[22px] font-extrabold text-slate-900">
            {profile.name}
          </Text>

          <Text className="text-sm text-slate-500 mt-1">
            @{profile.username_display}
          </Text>
        </View>

        {/* ---------- BODY METRICS ---------- */}
        <View className="bg-white rounded-[28px] p-6 mb-6 shadow-sm">
          <Text className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">
            BODY METRICS
          </Text>

          <View className="flex-row justify-between">
            <MetricItem label="Age" value={`${profile.age}`} />
            <MetricItem label="Weight" value={`${profile.weight} kg`} />
            <MetricItem label="Height" value={`${profile.height} cm`} />
          </View>
          <View className="flex-row justify-between">
            <MetricItem label="gender" value={`${profile.gender}`} />
            <MetricItem
              label="activity_level"
              value={`${profile.activity_level}`}
            />
            <MetricItem label="goal" value={`${profile.goal}`} />
          </View>
        </View>

        {/* ---------- MACRO GOALS ---------- */}
        <View className="bg-white rounded-[28px] p-6 mb-6 shadow-sm">
          <Text className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">
            MACRONUTRIENT GOALS
          </Text>

          <View className="flex-row justify-between">
            <MacroItem
              label="Protein"
              value={`${profile.target_protein}g`}
              color="text-blue-600"
            />
            <MacroItem
              label="Carbs"
              value={`${profile.target_carbs}g`}
              color="text-amber-600"
            />
            <MacroItem
              label="Fats"
              value={`${profile.target_fats}g`}
              color="text-rose-600"
            />
          </View>
        </View>
        {/* ---------- CALORIE GOAL ---------- */}
        <View className="bg-slate-900 rounded-[28px] p-6 mb-6">
          <Text className="text-xs font-bold tracking-widest text-slate-400 uppercase">
            DAILY CALORIE GOAL
          </Text>

          <Text className="text-4xl font-black text-white mt-1.5">
            {profile.target_calories} kcal
          </Text>
        </View>
        {/* STREAK SECTION Added relative and overflow-hidden to contain the decorative background circle */}
        <View className="bg-black rounded-[32px] p-7 shadow-xl shadow-emerald-900/20 relative overflow-hidden mb-10">
          {/* Subtle decorative background shape for a premium app feel */}
          <View className="absolute -top-12 -right-10 w-40 h-40 bg-emerald-800 rounded-full opacity-40" />

          {/* Content wrapper with z-10 so it sits above the decorative circle */}
          <View className="relative z-10">
            {/* Card Header & Badge */}
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xs font-bold tracking-[2px] text-white uppercase">
                Total Days Logged
              </Text>
              {/* Gamification Badge */}
              {streak > 0 && (
                <View className="bg-orange-500/20 px-2.5 py-1 rounded-full flex-row items-center">
                  <Text className="text-xs font-bold text-orange-400">
                    Streak
                  </Text>
                </View>
              )}
            </View>

            {/* Large Number Callout */}
            <View className="flex-row items-baseline mt-2 mb-1">
              <Text className="text-[64px] font-black text-white tracking-tighter mr-3 leading-none">
                {streak}
              </Text>
              <Text className="text-xl font-bold text-white">days</Text>
            </View>

            {/* Divider */}
            <View className="h-[1px] bg-white my-5" />

            {/* Footer Text */}
            <Text className="text-sm font-medium text-white leading-relaxed pr-4">
              Start logging meals to unlock insights about your eating habits.
              Keep the momentum going!
            </Text>
          </View>
        </View>

        {/* ---------- SETTINGS ---------- */}
        <View className="bg-white rounded-[28px] overflow-hidden shadow-sm mb-8">
          <SettingsRow
            icon="edit-3"
            label="Edit Profile"
            onPress={() => setShowEditProfile(true)}
          />
          <SettingsRow icon="info" label="About this app" />
        </View>
        {/* ---------- Edit Modal ---------- */}
        <EditProfileModal
          visible={showEditProfile}
          onClose={() => setShowEditProfile(false)}
          profile={profile}
          onSave={handleSaveProfile}
        />

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
