import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { BlurView } from "expo-blur";

type LoadingOverlayProps = {
  text?: string;
};

export default function LoadingOverlay({
  text = "Please wait…",
}: LoadingOverlayProps) {
  return (
    <View style={styles.root} pointerEvents="auto">
      {/* 🔹 BLUR + DIM BACKGROUND */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 200 }}
        style={StyleSheet.absoluteFill}
      >
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, styles.dim]} />
      </MotiView>

      {/* 🔹 CENTERED CARD */}
      <View style={styles.center}>
        <MotiView
          from={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 14, stiffness: 180 }}
          style={styles.card}
        >
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.text}>{text}</Text>
        </MotiView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999, // 🔑 Android
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dim: {
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 28,
    paddingHorizontal: 32,
    paddingVertical: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  text: {
    marginTop: 16,
    color: "#334155",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
