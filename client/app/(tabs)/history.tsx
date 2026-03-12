import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="px-6 pt-6 pb-28"
        showsVerticalScrollIndicator={false}
      >
        {/* ---------- Header ---------- */}
        <View className="mb-8">
          <Text className="text-[34px] font-black text-slate-900 tracking-tight">
            History
          </Text>
          <Text className="mt-2 text-[15px] text-slate-500 max-w-[260px]">
            Track your past calorie and macro intake over time
          </Text>
        </View>

        {/* ---------- Summary Card ---------- */}
        <View className="bg-slate-900 rounded-[30px] p-7 mb-10 shadow-xl shadow-slate-900/20">
          <Text className="text-[11px] font-bold tracking-[2px] text-slate-400 uppercase">
            Total Days Logged
          </Text>

          <View className="flex-row items-end mt-3 mb-2">
            <Text className="text-5xl font-black text-white mr-2">0</Text>
            <Text className="text-base text-slate-400 mb-1">days</Text>
          </View>

          <View className="h-px bg-slate-700/60 my-4" />

          <Text className="text-sm text-indigo-200 leading-5">
            Start logging meals to unlock insights about your eating habits.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
