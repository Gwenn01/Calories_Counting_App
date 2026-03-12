import { Stack, Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { getToken } from "@/utils/token";
import LoadingOverlay from "@/components/LoadingOverplay";

export default function AuthLayout() {
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const t = await getToken();
      setToken(t);
      setReady(true);
    };

    checkAuth();
  }, []);

  if (!ready) {
    return <LoadingOverlay text="Checking authentication..." />;
  }

  // If token exists, skip auth screens
  if (token) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
