import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { SettingsRow } from "../../components/general/SettingsRow";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* ---------- Header ---------- */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.subText}>Fitness Tracking</Text>
        </View>

        {/* ---------- Goal Card ---------- */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>DAILY CALORIE GOAL</Text>
          <Text style={styles.goalValue}>2000 kcal</Text>
        </View>

        {/* ---------- Settings ---------- */}
        <View style={styles.settingsCard}>
          <SettingsRow icon="edit-3" label="Edit calorie goal" />
          <SettingsRow icon="trending-up" label="Update weight" />
          <SettingsRow icon="info" label="About this app" />
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
    paddingBottom: 60,
  },

  /* ---------- Header ---------- */
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
  },
  subText: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },

  /* ---------- Cards ---------- */
  card: {
    backgroundColor: "#0f172a",
    borderRadius: 28,
    padding: 24,
    marginBottom: 24,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#94a3b8",
  },
  goalValue: {
    fontSize: 36,
    fontWeight: "900",
    color: "#ffffff",
    marginTop: 6,
  },

  settingsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 32,
  },

  // /* ---------- Logout ---------- */
  // logout: {
  //   alignItems: "center",
  //   paddingVertical: 16,
  // },
  // logoutText: {
  //   fontSize: 16,
  //   fontWeight: "700",
  //   color: "#ef4444",
  // },
});
