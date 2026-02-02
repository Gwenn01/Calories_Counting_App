import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { MotiView } from "moti";
import { useState } from "react";

/* ---------- Helpers ---------- */
const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function MacrosScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const goPrevDay = () =>
    setCurrentDate((d) => new Date(d.setDate(d.getDate() - 1)));

  const goNextDay = () =>
    setCurrentDate((d) => new Date(d.setDate(d.getDate() + 1)));

  const dataByDate: Record<string, any> = {
    "2026-01-27": {
      consumed: { calories: 1650, protein: 120, carbs: 180, fat: 55 },
      targets: { calories: 2000, protein: 150, carbs: 200, fat: 65 },
    },
    "2026-01-28": {
      consumed: { calories: 1420, protein: 110, carbs: 160, fat: 48 },
      targets: { calories: 2000, protein: 150, carbs: 200, fat: 65 },
    },
    "2026-02-01": {
      consumed: { calories: 1240, protein: 95, carbs: 140, fat: 42 },
      targets: { calories: 2000, protein: 150, carbs: 200, fat: 65 },
    },
    "2026-02-02": {
      consumed: { calories: 980, protein: 70, carbs: 120, fat: 30 },
      targets: { calories: 2000, protein: 150, carbs: 200, fat: 65 },
    },
  };

  const key = currentDate.toISOString().slice(0, 10);
  const { consumed, targets } = dataByDate[key];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="px-6 pt-4"
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------- HEADER ---------- */}
        <View className="flex-row items-center justify-between mb-6">
          <Pressable className="bg-white p-2.5 rounded-2xl border border-slate-100">
            <Feather name="chevron-left" size={22} color="#0f172a" />
          </Pressable>

          <View className="items-center">
            <Text className="text-xs font-bold tracking-[2px] uppercase text-slate-400 mb-0.5">
              Nutrients
            </Text>
            <Text className="text-xl font-black text-slate-900">
              {formatDate(currentDate)}
            </Text>
          </View>

          <Pressable className="bg-white p-2.5 rounded-2xl border border-slate-100">
            <Feather name="chevron-right" size={22} color="#0f172a" />
          </Pressable>
        </View>

        {/* ---------- CALORIE CARD ---------- */}
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 rounded-[36px] p-7 mb-8 overflow-hidden"
        >
          <View className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-emerald-500/10" />

          <View className="flex-row justify-between items-start">
            <View>
              <Text className="text-xs font-bold tracking-[2px] uppercase text-emerald-400 mb-2">
                Energy
              </Text>

              <View className="flex-row items-baseline">
                <Text className="text-[56px] font-black text-white">
                  {consumed.calories}
                </Text>
                <Text className="text-lg font-bold text-slate-500 ml-2">
                  kcal
                </Text>
              </View>

              <Text className="mt-1 text-sm text-slate-400">
                of {targets.calories} daily target
              </Text>
            </View>

            <View className="bg-slate-800 p-3 rounded-2xl">
              <Feather name="zap" size={24} color="#10b981" />
            </View>
          </View>

          <View className="h-2 bg-slate-800 rounded-full mt-7 overflow-hidden">
            <View
              className="h-full bg-emerald-500 rounded-full"
              style={{
                width: `${(consumed.calories / targets.calories) * 100}%`,
              }}
            />
          </View>
        </MotiView>

        {/* ---------- MACROS ---------- */}
        <View className="gap-4">
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

/* ---------- Macro Card ---------- */

function MacroProgressCard({ label, value, target, color, icon, unit }: any) {
  const percentage = Math.min((value / target) * 100, 100);

  return (
    <MotiView
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      className="bg-white p-6 rounded-[28px] border border-slate-100"
    >
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <View
            className="p-2 rounded-xl mr-3"
            style={{ backgroundColor: `${color}20` }}
          >
            <Feather name={icon} size={16} color={color} />
          </View>
          <Text className="text-lg font-extrabold text-slate-900">{label}</Text>
        </View>

        <View className="flex-row items-baseline">
          <Text className="text-lg font-black text-slate-900">{value}</Text>
          <Text className="text-xs font-bold text-slate-400 ml-1">
            / {target}
            {unit}
          </Text>
        </View>
      </View>

      <View className="h-3 bg-slate-50 rounded-full overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </View>

      <View className="flex-row justify-between mt-2">
        <Text className="text-[10px] font-bold uppercase text-slate-400">
          {Math.round(percentage)}% Achieved
        </Text>
        <Text className="text-[10px] font-bold uppercase text-slate-400">
          {target - value}
          {unit} Left
        </Text>
      </View>
    </MotiView>
  );
}
