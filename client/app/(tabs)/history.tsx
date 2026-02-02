import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView contentContainerClassName="p-6 pb-20">
        {/* ---------- Header ---------- */}
        <View className="mb-7">
          <Text className="text-3xl font-black text-slate-900">History</Text>
          <Text className="mt-1.5 text-[15px] text-slate-500">
            Track your past calorie and macro intake
          </Text>
        </View>

        {/* ---------- Summary Card ---------- */}
        <View className="bg-slate-900 rounded-[28px] p-6 mb-8">
          <Text className="text-xs font-bold tracking-widest text-slate-400 uppercase">
            TOTAL DAYS LOGGED
          </Text>

          <Text className="text-5xl font-black text-white my-1.5">0</Text>

          <Text className="text-sm text-indigo-200">
            Start logging meals to build your history
          </Text>
        </View>

        {/* ---------- Empty State ---------- */}
        <View className="items-center mt-10 px-5">
          <Text className="text-[42px] mb-3">📊</Text>

          <Text className="text-lg font-extrabold text-slate-900 mb-1.5">
            No history yet
          </Text>

          <Text className="text-sm text-slate-500 text-center leading-5">
            Your past calorie logs will appear here once you start tracking.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
