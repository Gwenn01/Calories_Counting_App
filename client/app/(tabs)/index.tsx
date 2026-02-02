import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

export default function TodayScreen() {
  const dailyGoal = 2000;
  const consumed = 850;
  const remaining = dailyGoal - consumed;
  const progress = (consumed / dailyGoal) * 100;

  return (
    <SafeAreaView className="flex-1 bg-slate-50 px-5">
      {/* Header */}
      <View className="mt-3 mb-6">
        <Text className="text-xs font-bold tracking-[2px] uppercase text-slate-400 mb-1">
          Overview
        </Text>
        <Text className="text-4xl font-black text-slate-900">Today</Text>
      </View>

      {/* Hero Card */}
      <View className="bg-slate-900 rounded-[32px] p-6 mb-6">
        <View className="flex-row justify-between items-center">
          <Text className="text-sm font-bold tracking-wide text-emerald-400">
            Calories
          </Text>
          <View className="bg-slate-800 p-2.5 rounded-2xl">
            <Feather name="zap" size={22} color="#22c55e" />
          </View>
        </View>

        <View className="flex-row items-baseline mt-3">
          <Text className="text-[56px] font-black text-white">{consumed}</Text>
          <Text className="text-lg font-bold text-slate-500 ml-2">kcal</Text>
        </View>

        <Text className="mt-1.5 text-sm text-slate-400">
          {remaining} kcal remaining today
        </Text>

        {/* Progress Bar */}
        <View className="h-2 bg-slate-800 rounded-full mt-5 overflow-hidden">
          <View
            className="h-full bg-green-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </View>
      </View>

      {/* Stats Row */}
      <View className="flex-row gap-4">
        <View className="flex-1 bg-white py-5 rounded-3xl items-center border border-slate-100">
          <Text className="text-[22px] font-extrabold text-slate-900">
            {dailyGoal}
          </Text>
          <Text className="text-[13px] font-semibold text-slate-400 mt-1">
            Daily Goal
          </Text>
        </View>

        <View className="flex-1 bg-white py-5 rounded-3xl items-center border border-slate-100">
          <Text className="text-[22px] font-extrabold text-slate-900">
            {remaining}
          </Text>
          <Text className="text-[13px] font-semibold text-slate-400 mt-1">
            Remaining
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
