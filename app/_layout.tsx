import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";

import { AuthProvider } from "@/src/context/auth-context";
import { QueryProvider } from "@/src/providers/query-provider";

import "./globals.css";

LogBox.ignoreLogs([
  "SafeAreaView has been deprecated and will be removed in a future release.",
]);

export default function RootLayout() {
  return (
    <QueryProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: "#f0fdf4",
            },
          }}
        />
      </AuthProvider>
    </QueryProvider>
  );
}


