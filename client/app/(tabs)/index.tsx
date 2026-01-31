import { SafeAreaView, ScrollView, View } from "react-native";
import { Header } from "@/components/today/Header";
import { HeroCalories } from "@/components/today/HeroCalories";
import { CompactStat } from "@/components/today/CompactStat";
import { RecentMeal } from "@/components/today/RecentMeal";

export default function TodayScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <Header />

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <HeroCalories />

        <View className="flex-row gap-4 mb-10">
          <CompactStat
            label="Burned"
            value="420"
            icon="activity"
            color="#ef4444"
          />
          <CompactStat
            label="Steps"
            value="8,432"
            icon="trending-up"
            color="#3b82f6"
          />
        </View>

        <RecentMeal
          icon="coffee"
          title="Breakfast"
          subtitle="Oatmeal & Berries"
          calories="320"
          color="bg-slate-50"
        />

        <View className="h-4" />

        <RecentMeal
          icon="sun"
          title="Lunch"
          subtitle="Grilled Chicken"
          calories="530"
          color="bg-orange-50"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
