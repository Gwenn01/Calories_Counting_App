import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Flame } from "lucide-react-native";
// components
import { useAlert } from "@/components/AlertProvider";
import { useToast } from "@/components/ToastProvider";
import LoadingOverlay from "@/components/LoadingOverplay";
import { SettingsRow } from "../../components/Profile/SettingsRow";
import MacroItem from "@/components/Profile/MacroItem";
import MetricItem from "@/components/Profile/MetricItem";
import WorkoutProfileCard from "@/components/Profile/WorkoutProfileCard";
import FitnessProfileModal from "@/components/Profile/FitnessProfileModal";
import EditProfileModal from "@/components/Profile/EditProfileModal";
// token
import { removeToken } from "@/utils/token";
import { Platform } from "react-native";
import { logoutUser } from "@/api/auth";
// apis
import { fetchProfile, editProfile } from "@/api/profile";
import {
  createWorkoutProfile,
  updateWorkoutProfile,
  fetchWorkoutProfile,
} from "@/api/workout";
import { getStreak } from "@/api/history";
// types
import { FitnessProfile } from "@/types/workout";

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
  // workout profile
  const [showModal, setShowModal] = useState(false);
  const [workoutProfile, setWorkoutProfile] = useState<FitnessProfile | null>(
    null,
  );

  // fetch profile data ===================================================
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const profileData = await fetchProfile();
      const workoutProfileData = await fetchWorkoutProfile();
      setProfile(profileData);
      setWorkoutProfile(workoutProfileData);
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
  // fetch streak ===========================================
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
  // functions ===============================================
  const handleSaveProfile = async (data: any) => {
    try {
      setLoading(true);
      await editProfile(data); // PUT request
      setProfile(data);
      setShowEditProfile(false);
      showToast("Success!", "Update successful", "success");
      await fetchProfileData();
    } catch (error) {
      showToast("Error", "Server error", "error");
      console.log("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // workout profile
  const handleSubmitWorkoutProfile = async (data: FitnessProfile) => {
    try {
      setLoading(true);
      let res;
      if (profile) {
        // UPDATE
        res = await updateWorkoutProfile(data);
      } else {
        // CREATE
        res = await createWorkoutProfile(data);
      }
      const profileData = res.data ?? res;

      setProfile(profileData);
      setShowModal(false);
      showToast("Success!", "Update successful", "success");
      await fetchProfileData();
    } catch (err) {
      console.error("Profile error:", err);
    } finally {
      setLoading(false);
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
  // if there is an error ==========================================================
  if (!profile) {
    <SafeAreaView className="flex-1 items-center justify-center bg-neutral-50">
      <Text className="text-neutral-500 text-sm">
        Something went wrong. Please try again.
      </Text>

      <Pressable
        onPress={handleSignOut}
        className="flex-row items-center justify-between px-5 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm"
      >
        <View className="flex-row items-center gap-3">
          <View className="bg-red-50 p-2 rounded-xl">
            <Feather name="log-out" size={18} color="#ef4444" />
          </View>
          <Text className="text-slate-900 font-bold text-base">Sign Out</Text>
        </View>
        <Feather name="chevron-right" size={20} color="#cbd5e1" />
      </Pressable>
    </SafeAreaView>;
  }
  // main tsx ========================================================
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* GLOBAL LOADING */}
      {loading && <LoadingOverlay text="Fetching Profile Data..." />}
      <ScrollView
        className="p-6"
        contentContainerStyle={{ paddingBottom: 120 }} // space for tabs
        showsVerticalScrollIndicator={false}
      >
        {/* ---------- HEADER ---------- */}
        <View
          className="rounded-[28px] p-4 mb-3"
          style={{
            backgroundColor: "#0f172a",
            borderWidth: 1,
            borderColor: "#1e293b",
            shadowColor: "#0000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 50,
            elevation: 10,
          }}
        >
          <View className="flex-row items-center gap-4">
            {/* Avatar */}
            <View
              className="w-16 h-16 rounded-[20px] items-center justify-center"
              style={{
                backgroundColor: "#052e16",
                borderWidth: 1.5,
                borderColor: "#14532d",
              }}
            >
              <Text
                className="text-emerald-400 font-black"
                style={{ fontSize: 20, letterSpacing: -0.5 }}
              >
                {profile.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </Text>
            </View>

            {/* Info */}
            <View className="flex-1 justify-center">
              <Text
                className="text-slate-100 font-black mb-0.5"
                style={{ fontSize: 18, letterSpacing: -0.4 }}
              >
                {profile.name}
              </Text>
              <View className="flex-row items-center gap-1.5">
                <View
                  className="rounded-full px-2 py-0.5"
                  style={{
                    backgroundColor: "#1e293b",
                    borderWidth: 1,
                    borderColor: "#334155",
                  }}
                >
                  <Text
                    className="text-slate-500 font-bold"
                    style={{ fontSize: 10, letterSpacing: 0.5 }}
                  >
                    @{profile.username_display}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ---------- BODY METRICS + MACRO GOALS ---------- */}
        <View
          className="bg-white rounded-[28px] p-5 mb-3"
          style={{
            borderWidth: 1,
            borderColor: "#f1f5f9",
            shadowColor: "#94a3b8",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 4,
          }}
        >
          {/* Header */}
          <View className="flex-row items-center mb-4">
            <Text className="text-xs font-bold tracking-widest text-slate-400 uppercase flex-1">
              PROFILE
            </Text>

            <Pressable
              onPress={() => setShowEditProfile(true)}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                backgroundColor: "#f0fdf4",
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#bbf7d0",
              })}
            >
              <View className="flex-row items-center" style={{ gap: 4 }}>
                <Feather name="edit-2" size={12} color="#16a34a" />
                <Text className="text-emerald-600 font-bold text-xs">Edit</Text>
              </View>
            </Pressable>
          </View>

          {/* ── Body Metrics ── */}
          <Text className="text-[10px] font-bold tracking-widest text-slate-300 uppercase mb-2 ml-1">
            Body Metrics
          </Text>

          <View className="flex-row mb-2 mx-[-4px]">
            <MetricItem metricKey="age" value={`${profile.age} yrs`} />
            <MetricItem metricKey="weight" value={`${profile.weight} kg`} />
            <MetricItem metricKey="height" value={`${profile.height} cm`} />
          </View>

          <View className="flex-row mb-4 mx-[-4px]">
            <MetricItem metricKey="gender" value={`${profile.gender}`} />
            <MetricItem
              metricKey="activity_level"
              value={`${profile.activity_level}`}
            />
            <MetricItem metricKey="goal" value={`${profile.goal}`} />
          </View>

          {/* Divider */}
          <View className="h-[1px] bg-slate-100 mb-4" />

          {/* ── Macronutrient Goals ── */}
          <Text className="text-[10px] font-bold tracking-widest text-slate-300 uppercase mb-2 ml-1">
            Macronutrient Goals
          </Text>

          <View className="flex-row mx-[-4px]">
            <MacroItem
              metricKey="calories"
              label="Calories"
              value={profile.target_calories}
              unit="kcal"
            />
            <MacroItem
              metricKey="protein"
              label="Protein"
              value={profile.target_protein}
              unit="g"
            />
            <MacroItem
              metricKey="carbs"
              label="Carbs"
              value={profile.target_carbs}
              unit="g"
            />
            <MacroItem
              metricKey="fats"
              label="Fats"
              value={profile.target_fats}
              unit="g"
            />
          </View>
        </View>

        {/* ---------- Edit Modal ---------- */}
        <EditProfileModal
          visible={showEditProfile}
          onClose={() => setShowEditProfile(false)}
          profile={profile}
          onSave={handleSaveProfile}
        />

        {/* ---------- STREAK SECTION ---------- */}
        {/* Added relative and overflow-hidden to contain the decorative background circle */}
        <View className="bg-white rounded-[32px] p-7 shadow-sm border border-gray-100 relative overflow-hidden mb-3">
          {/* Subtle decorative background shape for a premium app feel */}
          <View className="absolute -top-12 -right-10 w-40 h-40 bg-green-400 rounded-full opacity-[0.08]" />

          {/* Content wrapper with z-10 so it sits above the decorative circle */}
          <View className="relative z-10">
            {/* Card Header & Badge */}
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xs font-bold tracking-[2px] text-gray-400 uppercase">
                Total Days Logged
              </Text>

              {/* Gamification Badge */}
              {streak > 0 && (
                <View className="bg-orange-50 px-2.5 py-1.5 rounded-full flex-row items-center border border-orange-100 gap-1">
                  {/* Note: Import Flame from lucide-react-native if you haven't already */}
                  <Flame size={12} color="#f97316" />
                  <Text className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">
                    Streak
                  </Text>
                </View>
              )}
            </View>

            {/* Large Number Callout */}
            <View className="flex-row items-baseline mt-2 mb-1">
              <Text className="text-[64px] font-black text-gray-900 tracking-tighter mr-3 leading-none">
                {streak}
              </Text>
              <Text className="text-xl font-bold text-gray-400">days</Text>
            </View>

            {/* Divider */}
            <View className="h-[1px] bg-gray-100 my-5" />

            {/* Footer Text */}
            <Text className="text-sm font-medium text-gray-500 leading-relaxed pr-4">
              Start logging meals to unlock insights about your eating habits.
              Keep the momentum going!
            </Text>
          </View>
        </View>

        {/* ---------- WORKOUT PROFILE ---------- */}
        {workoutProfile && (
          <WorkoutProfileCard
            profile={workoutProfile}
            onOpenModal={() => setShowModal(true)}
          />
        )}

        {/* MODAL */}
        <FitnessProfileModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitWorkoutProfile}
          initialData={workoutProfile}
        />

        {/* ---------- SIGN OUT ---------- */}
        <Pressable
          onPress={handleSignOut}
          className="flex-row items-center justify-between px-5 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm"
        >
          <View className="flex-row items-center gap-3">
            <View className="bg-red-50 p-2 rounded-xl">
              <Feather name="log-out" size={18} color="#ef4444" />
            </View>
            <Text className="text-slate-900 font-bold text-base">Sign Out</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#cbd5e1" />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
