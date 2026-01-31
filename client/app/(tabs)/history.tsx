import React from "react";
import { View, Text, ScrollView, SafeAreaView, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MotiView } from "moti";

export default function HistoryScreen() {
  // Mock data for the calendar strip
  const days = [
    { day: "Mon", date: "26", active: false },
    { day: "Tue", date: "27", active: false },
    { day: "Wed", date: "28", active: false },
    { day: "Thu", date: "29", active: false },
    { day: "Fri", date: "30", active: false },
    { day: "Sat", date: "31", active: false },
    { day: "Sun", date: "1", active: true }, // Today
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1 px-6 pt-4"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-[2px] mb-1">
              Log Journal
            </Text>
            <Text className="text-slate-900 text-3xl font-black">History</Text>
          </View>
          <Pressable className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
            <Feather name="filter" size={20} color="#10b981" />
          </Pressable>
        </View>

        {/* Weekly Calendar Strip */}
        <View className="flex-row justify-between mb-8">
          {days.map((item, index) => (
            <View key={index} className="items-center">
              <Text className="text-slate-400 text-[10px] font-bold uppercase mb-2">
                {item.day}
              </Text>
              <View
                className={`w-10 h-14 rounded-2xl items-center justify-center ${item.active ? "bg-emerald-500 shadow-lg shadow-emerald-200" : "bg-white border border-slate-100"}`}
              >
                <Text
                  className={`font-bold text-base ${item.active ? "text-white" : "text-slate-900"}`}
                >
                  {item.date}
                </Text>
                {item.active && (
                  <View className="w-1 h-1 bg-white rounded-full mt-1" />
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Summary Mini Card */}
        <View className="bg-slate-900 rounded-[32px] p-6 mb-8 flex-row justify-between items-center">
          <View>
            <Text className="text-slate-400 text-xs font-bold uppercase mb-1">
              Weekly Average
            </Text>
            <Text className="text-white text-2xl font-black">1,942 kcal</Text>
          </View>
          <View className="bg-emerald-500/20 p-3 rounded-2xl">
            <Feather name="trending-up" size={24} color="#10b981" />
          </View>
        </View>

        {/* Timeline Logs */}
        <Text className="text-slate-900 text-xl font-black mb-4">
          Past Logs
        </Text>

        <HistoryItem
          time="8:30 PM"
          title="Late Night Snack"
          kcal="210"
          icon="moon"
          color="#6366f1"
          delay={100}
        />
        <HistoryItem
          time="2:15 PM"
          title="Protein Shake"
          kcal="180"
          icon="zap"
          color="#f59e0b"
          delay={200}
        />
        <HistoryItem
          time="1:00 PM"
          title="Grilled Chicken Salad"
          kcal="450"
          icon="sun"
          color="#10b981"
          delay={300}
        />
        <HistoryItem
          time="9:00 AM"
          title="Scrambled Eggs"
          kcal="320"
          icon="coffee"
          color="#ec4899"
          delay={400}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// Timeline Item Component
function HistoryItem({ time, title, kcal, icon, color, delay }: any) {
  return (
    <MotiView
      from={{ opacity: 0, translateX: -10 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ delay }}
      className="flex-row items-center mb-6"
    >
      {/* Time and Vertical Line */}
      <View className="items-center mr-4">
        <Text className="text-slate-400 text-[10px] font-bold w-12 text-right">
          {time}
        </Text>
      </View>

      {/* Content Card */}
      <View className="flex-1 bg-white p-4 rounded-3xl flex-row items-center border border-slate-100 shadow-sm shadow-slate-200">
        <View
          style={{ backgroundColor: `${color}15` }}
          className="p-3 rounded-2xl"
        >
          <Feather name={icon} size={18} color={color} />
        </View>
        <View className="ml-4 flex-1">
          <Text className="text-slate-900 font-extrabold text-sm">{title}</Text>
          <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">
            Verified Entry
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-slate-900 font-black text-base">{kcal}</Text>
          <Text className="text-slate-400 text-[8px] font-bold uppercase">
            kcal
          </Text>
        </View>
      </View>
    </MotiView>
  );
}
