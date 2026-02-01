import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function TodayScreen() {
  const dailyGoal = 2000;
  const consumed = 850;
  const remaining = dailyGoal - consumed;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.subtitle}>Overview</Text>
        <Text style={styles.title}>Today</Text>
      </View>

      {/* Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <Text style={styles.heroLabel}>Calories</Text>
          <View style={styles.icon}>
            <Feather name="zap" size={22} color="#22c55e" />
          </View>
        </View>

        <View style={styles.heroValueRow}>
          <Text style={styles.heroValue}>{consumed}</Text>
          <Text style={styles.heroUnit}>kcal</Text>
        </View>

        <Text style={styles.heroSub}>{remaining} kcal remaining today</Text>

        {/* Progress Bar */}
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${(consumed / dailyGoal) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.row}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{dailyGoal}</Text>
          <Text style={styles.statLabel}>Daily Goal</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{remaining}</Text>
          <Text style={styles.statLabel}>Remaining</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
  },

  /* Header */
  header: {
    marginTop: 12,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#94a3b8",
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0f172a",
  },

  /* Hero Card */
  heroCard: {
    backgroundColor: "#0f172a",
    borderRadius: 32,
    padding: 24,
    marginBottom: 24,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#34d399",
    letterSpacing: 1,
  },
  icon: {
    backgroundColor: "#1e293b",
    padding: 10,
    borderRadius: 14,
  },
  heroValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 12,
  },
  heroValue: {
    fontSize: 56,
    fontWeight: "900",
    color: "#ffffff",
  },
  heroUnit: {
    fontSize: 18,
    fontWeight: "700",
    color: "#64748b",
    marginLeft: 8,
  },
  heroSub: {
    marginTop: 6,
    fontSize: 14,
    color: "#94a3b8",
  },

  /* Progress */
  progressTrack: {
    height: 8,
    backgroundColor: "#1e293b",
    borderRadius: 4,
    marginTop: 20,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#22c55e",
    borderRadius: 4,
  },

  /* Bottom Stats */
  row: {
    flexDirection: "row",
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingVertical: 20,
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
  },
  statLabel: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 4,
    fontWeight: "600",
  },
});
