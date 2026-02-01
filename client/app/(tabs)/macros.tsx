import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { MotiView } from "moti";

/* ---------- Helpers ---------- */
const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function MacrosScreen() {
  /* ---------- DATE STATE ---------- */
  const [currentDate, setCurrentDate] = useState(new Date());

  const goPrevDay = () =>
    setCurrentDate((d) => new Date(d.setDate(d.getDate() - 1)));

  const goNextDay = () =>
    setCurrentDate((d) => new Date(d.setDate(d.getDate() + 1)));

  /* ---------- MOCK DATA PER DATE ---------- */
  const dataByDate: Record<string, any> = {
    "2026-01-27": {
      consumed: { calories: 1650, protein: 120, carbs: 180, fat: 55 },
      targets: { calories: 2000, protein: 150, carbs: 200, fat: 65 },
    },
    "2026-01-28": {
      consumed: { calories: 1420, protein: 110, carbs: 160, fat: 48 },
      targets: { calories: 2000, protein: 150, carbs: 200, fat: 65 },
    },
    "2026-01-29": {
      consumed: { calories: 1780, protein: 135, carbs: 190, fat: 60 },
      targets: { calories: 2000, protein: 150, carbs: 200, fat: 65 },
    },
    "2026-01-30": {
      consumed: { calories: 1320, protein: 98, carbs: 150, fat: 44 },
      targets: { calories: 2000, protein: 150, carbs: 200, fat: 65 },
    },
    "2026-01-31": {
      consumed: { calories: 1500, protein: 115, carbs: 170, fat: 50 },
      targets: { calories: 2000, protein: 150, carbs: 200, fat: 65 },
    },

    /* existing days */
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
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------- HEADER WITH DATE ---------- */}
        <View style={styles.topHeader}>
          <Pressable style={styles.navButton} onPress={goPrevDay}>
            <Feather name="chevron-left" size={22} color="#0f172a" />
          </Pressable>

          <View style={{ alignItems: "center" }}>
            <Text style={styles.subtitle}>Nutrients</Text>
            <Text style={styles.title}>{formatDate(currentDate)}</Text>
          </View>

          <Pressable style={styles.navButton} onPress={goNextDay}>
            <Feather name="chevron-right" size={22} color="#0f172a" />
          </Pressable>
        </View>

        {/* ---------- CALORIE CARD ---------- */}
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={styles.calorieCard}
        >
          <View style={styles.calorieDecoration} />

          <View style={styles.calorieHeader}>
            <View>
              <Text style={styles.energyLabel}>Energy</Text>

              <View style={styles.calorieRow}>
                <Text style={styles.calorieValue}>{consumed.calories}</Text>
                <Text style={styles.calorieUnit}>kcal</Text>
              </View>

              <Text style={styles.calorieSubtext}>
                of {targets.calories} daily target
              </Text>
            </View>

            <View style={styles.iconBox}>
              <Feather name="zap" size={24} color="#10b981" />
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(consumed.calories / targets.calories) * 100}%`,
                },
              ]}
            />
          </View>
        </MotiView>

        {/* ---------- MACROS ---------- */}
        <View style={styles.macroList}>
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
      style={styles.macroCard}
    >
      <View style={styles.macroHeader}>
        <View style={styles.macroLeft}>
          <View style={[styles.macroIcon, { backgroundColor: `${color}20` }]}>
            <Feather name={icon} size={16} color={color} />
          </View>
          <Text style={styles.macroLabel}>{label}</Text>
        </View>

        <View style={styles.macroRight}>
          <Text style={styles.macroValue}>{value}</Text>
          <Text style={styles.macroTarget}>
            / {target}
            {unit}
          </Text>
        </View>
      </View>

      <View style={styles.macroTrack}>
        <View
          style={[
            styles.macroFill,
            { width: `${percentage}%`, backgroundColor: color },
          ]}
        />
      </View>

      <View style={styles.macroFooter}>
        <Text style={styles.macroFooterText}>
          {Math.round(percentage)}% Achieved
        </Text>
        <Text style={styles.macroFooterText}>
          {target - value}
          {unit} Left
        </Text>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 140,
  },

  /* ---------- Top Header (Date Nav) ---------- */
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  navButton: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 2,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0f172a",
    textAlign: "center",
  },

  /* ---------- Calorie Card ---------- */
  calorieCard: {
    backgroundColor: "#0f172a",
    borderRadius: 36,
    padding: 28,
    marginBottom: 32,
    overflow: "hidden",
  },
  calorieDecoration: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(16,185,129,0.12)",
  },
  calorieHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  energyLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#34d399",
    marginBottom: 8,
  },
  calorieRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  calorieValue: {
    fontSize: 56,
    fontWeight: "900",
    color: "#ffffff",
  },
  calorieUnit: {
    fontSize: 18,
    fontWeight: "700",
    color: "#64748b",
    marginLeft: 8,
  },
  calorieSubtext: {
    marginTop: 4,
    fontSize: 14,
    color: "#94a3b8",
  },
  iconBox: {
    backgroundColor: "#1e293b",
    padding: 12,
    borderRadius: 16,
  },

  /* ---------- Progress ---------- */
  progressTrack: {
    height: 8,
    backgroundColor: "#1e293b",
    borderRadius: 4,
    marginTop: 28,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 4,
  },

  /* ---------- Macro Cards ---------- */
  macroList: {
    gap: 16,
  },
  macroCard: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  macroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  macroLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  macroIcon: {
    padding: 8,
    borderRadius: 10,
    marginRight: 12,
  },
  macroLabel: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },
  macroRight: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  macroValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0f172a",
  },
  macroTarget: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94a3b8",
    marginLeft: 4,
  },
  macroTrack: {
    height: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 6,
    overflow: "hidden",
  },
  macroFill: {
    height: "100%",
    borderRadius: 6,
  },
  macroFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  macroFooterText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
  },
});
