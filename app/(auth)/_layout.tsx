import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/src/context/auth-context";

export default function AuthLayout() {
  const { user } = useAuth();

  if (user) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: "#065f46",
        headerStyle: { backgroundColor: "#dcfce7" },
      }}
    />
  );
}
