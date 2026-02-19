import { Link, Stack } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from "react-native";

import { useAuth } from "@/src/context/auth-context";
import { getErrorMessage } from "@/src/utils/errors";

export default function SignupScreen() {
  const { signup } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (): Promise<void> => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "All fields are required.");
      return;
    }

    if (password.trim().length < 4) {
      Alert.alert("Weak password", "Password should be at least 4 characters.");
      return;
    }

    try {
      setIsSubmitting(true);
      await signup(username, email, password);
    } catch (error) {
      Alert.alert("Signup failed", getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-emerald-50 px-6">
      <Stack.Screen options={{ title: "Sign Up" }} />

      <Text className="text-4xl font-black text-emerald-900">Create account</Text>
      <Text className="mb-8 mt-2 text-base text-slate-600">Start joining EcoAction volunteer missions.</Text>

      <View className="gap-4 rounded-2xl border border-emerald-100 bg-white p-5">
        <View>
          <Text className="mb-2 text-sm font-medium text-slate-700">Username</Text>
          <TextInput
            className="rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900"
            onChangeText={setUsername}
            placeholder="Your name"
            value={username}
          />
        </View>

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
            placeholder="At least 4 characters"
            secureTextEntry
            value={password}
          />
        </View>

        <Pressable className="rounded-xl bg-emerald-600 px-4 py-3" disabled={isSubmitting} onPress={handleSignup}>
          <Text className="text-center text-base font-semibold text-white">
            {isSubmitting ? "Creating account..." : "Create account"}
          </Text>
        </Pressable>

        {isSubmitting ? <ActivityIndicator color="#059669" /> : null}

        <Text className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="font-semibold text-emerald-700" href="/(auth)/login">
            Login
          </Link>
        </Text>
      </View>
    </View>
  );
}

