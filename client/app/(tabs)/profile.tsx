import { View, Text, StyleSheet, Pressable } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {/* User Info */}
      <View style={styles.card}>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.subText}>Daily goal: 2000 kcal</Text>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Pressable style={styles.row}>
          <Text style={styles.rowText}>Edit daily calorie goal</Text>
        </Pressable>

        <Pressable style={styles.row}>
          <Text style={styles.rowText}>Change weight</Text>
        </Pressable>

        <Pressable style={styles.row}>
          <Text style={styles.rowText}>About</Text>
        </Pressable>
      </View>

      {/* Logout */}
      <Pressable style={styles.logout}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f4f4f4",
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  row: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rowText: {
    fontSize: 16,
  },
  logout: {
    marginTop: "auto",
    paddingVertical: 16,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    color: "red",
    fontWeight: "600",
  },
});
