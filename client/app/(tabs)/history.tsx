import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";

export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* ---------- Header ---------- */}
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
          <Text style={styles.subtitle}>
            Track your past calorie and macro intake
          </Text>
        </View>

        {/* ---------- Summary Card ---------- */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>TOTAL DAYS LOGGED</Text>
          <Text style={styles.summaryValue}>0</Text>
          <Text style={styles.summaryHint}>
            Start logging meals to build your history
          </Text>
        </View>

        {/* ---------- Empty State ---------- */}
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>No history yet</Text>
          <Text style={styles.emptyText}>
            Your past calorie logs will appear here once you start tracking.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    padding: 24,
    paddingBottom: 80,
  },

  /* ---------- Header ---------- */
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0f172a",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: "#64748b",
  },

  /* ---------- Summary Card ---------- */
  summaryCard: {
    backgroundColor: "#0f172a",
    borderRadius: 28,
    padding: 24,
    marginBottom: 32,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  summaryValue: {
    fontSize: 48,
    fontWeight: "900",
    color: "#ffffff",
    marginVertical: 6,
  },
  summaryHint: {
    fontSize: 14,
    color: "#cbd5f5",
  },

  /* ---------- Empty State ---------- */
  emptyState: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 42,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },
});
