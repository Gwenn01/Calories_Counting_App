import React from "react";
import { View, Text, ScrollView, SafeAreaView, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MotiView } from "moti";
// import { useMacroStore } from "@/store/macro.store"; // Assuming your store works

export default function MacrosScreen() {
  // Mock data for design - replace with your useMacroStore()
  const consumed = { calories: 1240, protein: 95, carbs: 140, fat: 42 };
  const targets = { calories: 2000, protein: 150, carbs: 200, fat: 65 };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1 px-6 pt-4"
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-8">
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-[2px] mb-1">
            Nutrients
          </Text>
          <Text className="text-slate-900 text-3xl font-black">Macros</Text>
        </View>

        {/* Hero Calorie Card - Sleek Dark Design */}
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 rounded-[40px] p-8 mb-8 shadow-2xl shadow-slate-400 relative overflow-hidden"
        >
          {/* Decorative background element */}
          <View className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full" />

          <View className="flex-row justify-between items-start relative z-10">
            <View>
              <Text className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">
                Energy
              </Text>
              <View className="flex-row items-baseline">
                <Text className="text-white text-6xl font-black">
                  {consumed.calories}
                </Text>
                <Text className="text-slate-500 text-lg font-bold ml-2">
                  kcal
                </Text>
              </View>
              <Text className="text-slate-400 mt-1 font-medium text-sm">
                of {targets.calories} daily target
              </Text>
            </View>
            <View className="bg-slate-800 p-3 rounded-2xl">
              <Feather name="zap" size={24} color="#10b981" />
            </View>
          </View>

          {/* Simple horizontal progress bar for calories */}
          <View className="h-2 w-full bg-slate-800 rounded-full mt-8 overflow-hidden">
            <View
              className="h-full bg-emerald-500 rounded-full"
              style={{
                width: `${(consumed.calories / targets.calories) * 100}%`,
              }}
            />
          </View>
        </MotiView>

        {/* Macro Detailed Cards */}
        <View className="gap-y-4">
          <MacroProgressCard
            label="Protein"
            value={consumed.protein}
            target={targets.protein}
            color="#10b981"
            icon="shield"
            unit="g"
          />
          <MacroProgressCard
            label="Carbs"
            value={consumed.carbs}
            target={targets.carbs}
            color="#3b82f6"
            icon="droplet"
            unit="g"
          />
          <MacroProgressCard
            label="Fat"
            value={consumed.fat}
            target={targets.fat}
            color="#f59e0b"
            icon="circle"
            unit="g"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Custom Macro Card Component
function MacroProgressCard({ label, value, target, color, icon, unit }: any) {
  const percentage = Math.min((value / target) * 100, 100);

  return (
    <MotiView
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      className="bg-white p-6 rounded-[30px] border border-slate-100 shadow-sm shadow-slate-200"
    >
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <View
            style={{ backgroundColor: `${color}15` }}
            className="p-2 rounded-lg mr-3"
          >
            <Feather name={icon} size={16} color={color} />
          </View>
          <Text className="text-slate-900 font-extrabold text-lg">{label}</Text>
        </View>
        <View className="flex-row items-baseline">
          <Text className="text-slate-900 font-black text-lg">{value}</Text>
          <Text className="text-slate-400 font-bold text-xs ml-1">
            / {target}
            {unit}
          </Text>
        </View>
      </View>

      {/* Progress Bar Area */}
      <View className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </View>

      <View className="flex-row justify-between mt-2">
        <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">
          {Math.round(percentage)}% Achieved
        </Text>
        <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">
          {target - value}
          {unit} Left
        </Text>
      </View>
    </MotiView>
  );
}
