import { Link, Stack } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from "react-native";

import { useAuth } from "@/src/context/auth-context";
import { getErrorMessage } from "@/src/utils/errors";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("sam@ecoaction.app");
  const [password, setPassword] = useState("eco123");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (): Promise<void> => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please enter email and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
    } catch (error) {
      Alert.alert("Login failed", getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-emerald-50 px-6">
      <Stack.Screen options={{ title: "Login" }} />

      <Text className="text-4xl font-black text-emerald-900">EcoAction</Text>
      <Text className="mb-8 mt-2 text-base text-slate-600">Volunteer for environmental missions near you.</Text>

      <View className="gap-4 rounded-2xl border border-emerald-100 bg-white p-5">
        <View>
          <Text className="mb-2 text-sm font-medium text-slate-700">Email</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            className="rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="you@ecoaction.app"
            value={email}
          />
        </View>

        <View>
          <Text className="mb-2 text-sm font-medium text-slate-700">Password</Text>
          <TextInput
            className="rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900"
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            value={password}
          />
        </View>

        <Pressable className="rounded-xl bg-emerald-600 px-4 py-3" disabled={isSubmitting} onPress={handleLogin}>
          <Text className="text-center text-base font-semibold text-white">{isSubmitting ? "Logging in..." : "Login"}</Text>
        </Pressable>

        {isSubmitting ? <ActivityIndicator color="#059669" /> : null}

        <Text className="text-center text-sm text-slate-600">
          No account yet?{" "}
          <Link className="font-semibold text-emerald-700" href="/(auth)/signup">
            Sign up
          </Link>
        </Text>
      </View>
    </View>
  );
}

