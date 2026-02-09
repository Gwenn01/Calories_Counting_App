import { View, Text, ActivityIndicator } from "react-native";
import { MotiView } from "moti";
import { BlurView } from "expo-blur";

type LoadingOverlayProps = {
  text?: string;
};

export default function LoadingOverlay({
  text = "Please wait...",
}: LoadingOverlayProps) {
  return (
    <View className="absolute inset-0 z-50 items-center justify-center">
      {/* 🔹 BLUR BACKGROUND */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "timing", duration: 200 }}
        className="absolute inset-0"
      >
        <BlurView intensity={30} tint="dark" className="absolute inset-0" />
        {/* optional dark overlay for contrast */}
        <View className="absolute inset-0 bg-black/20" />
      </MotiView>

      {/* 🔹 CARD */}
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          damping: 15,
          stiffness: 200,
        }}
        className="bg-white rounded-3xl px-8 py-6 items-center shadow-xl"
      >
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-slate-600 text-sm font-semibold">
          {text}
        </Text>
      </MotiView>
    </View>
  );
}
