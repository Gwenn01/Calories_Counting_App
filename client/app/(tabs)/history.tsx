import { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getStreak } from "@/api/history";
import LoadingOverlay from "@/components/LoadingOverplay";

export default function HistoryScreen() {
  const [loading, setLoading] = useState(false);
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

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {loading && <LoadingOverlay text="Loading nutrition..." />}
      <ScrollView
        className="px-6 pt-4 pb-28"
        showsVerticalScrollIndicator={false}
      >
        {/* ---------- Header ---------- */}
        <View className="mb-8 mt-2">
          <Text className="text-[32px] font-extrabold text-slate-900 tracking-tight">
            History
          </Text>
          <Text className="mt-1.5 text-base font-medium text-slate-500">
            Track your past calorie and macro intake.
          </Text>
        </View>

        {/* ---------- Summary Card (Premium Emerald Theme) ---------- */}
        {/* Added relative and overflow-hidden to contain the decorative background circle */}
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
      </ScrollView>
    </SafeAreaView>
  );
}
