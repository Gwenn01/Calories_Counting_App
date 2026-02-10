import { Stack } from "expo-router";
import { ToastProvider } from "@/components/ToastProvider";
import { AlertProvider } from "@/components/AlertProvider";

export default function RootLayout() {
  return (
    // 1. Wrap the entire navigation stack in the provider
    <ToastProvider>
      <AlertProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* You don't strictly need to list every screen here 
           if you just want defaults, but it's good practice.
        */}
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </AlertProvider>
    </ToastProvider>
  );
}
