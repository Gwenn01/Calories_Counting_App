import { View, Text, ScrollView } from "react-native";
import { SettingsRow } from "../../components/general/SettingsRow";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView contentContainerClassName="p-6 pb-16">
        {/* ---------- Header ---------- */}
        <View className="items-center mb-8">
          <View className="w-[72px] h-[72px] rounded-full bg-slate-900 items-center justify-center mb-3">
            <Text className="text-white text-2xl font-black">JD</Text>
          </View>

          <Text className="text-[22px] font-extrabold text-slate-900">
            John Doe
          </Text>

          <Text className="text-sm text-slate-500 mt-1">Fitness Tracking</Text>
        </View>

        {/* ---------- Goal Card ---------- */}
        <View className="bg-slate-900 rounded-[28px] p-6 mb-6">
          <Text className="text-xs font-bold tracking-widest text-slate-400 uppercase">
            DAILY CALORIE GOAL
          </Text>

          <Text className="text-4xl font-black text-white mt-1.5">
            2000 kcal
          </Text>
        </View>

        {/* ---------- Settings ---------- */}
        <View className="bg-white rounded-[28px] overflow-hidden mb-8">
          <SettingsRow icon="edit-3" label="Edit calorie goal" />
          <SettingsRow icon="trending-up" label="Update weight" />
          <SettingsRow icon="info" label="About this app" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
