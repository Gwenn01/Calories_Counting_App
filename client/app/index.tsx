// app/index.tsx
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { getToken } from "@/utils/token";
import LoadingOverlay from "@/components/LoadingOverplay";

export default function Index() {
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const isAuthenticated = Boolean(token && token.length > 10);

  useEffect(() => {
    (async () => {
      const t = await getToken();
      setToken(t);
      setReady(true);
    })();
  }, []);

  if (!ready) return <LoadingOverlay text="Starting app..." />;

  return isAuthenticated ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Redirect href="/(auth)/sign-in" />
  );
}
