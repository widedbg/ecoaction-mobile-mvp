import { Alert, Pressable, Text, View } from "react-native";

import { ErrorPanel, LoadingPanel } from "@/src/components/state-panels";
import { useAuth } from "@/src/context/auth-context";
import { useMissionsQuery } from "@/src/hooks/use-missions";
import { getErrorMessage } from "@/src/utils/errors";

const isCompleted = (dateIso: string): boolean => new Date(dateIso).getTime() < Date.now();

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const missionsQuery = useMissionsQuery(user?.id);

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch {
      Alert.alert("Error", "Could not log out.");
    }
  };

  if (!user) {
    return <LoadingPanel label="Loading profile..." />;
  }

  if (missionsQuery.isLoading) {
    return <LoadingPanel label="Loading profile..." />;
  }

  if (missionsQuery.isError) {
    return <ErrorPanel label={getErrorMessage(missionsQuery.error, "Could not load profile.")} onRetry={() => void missionsQuery.refetch()} />;
  }

  const completedCount = (missionsQuery.data ?? []).filter((mission) => mission.isRegistered && isCompleted(mission.date)).length;

  return (
    <View className="flex-1 bg-emerald-50 px-4 pt-4">
      <View className="rounded-2xl border border-emerald-100 bg-white p-5">
        <Text className="text-2xl font-bold text-slate-900">{user.username}</Text>
        <Text className="mt-1 text-base text-slate-600">{user.email}</Text>
      </View>

      <View className="mt-4 rounded-2xl border border-emerald-100 bg-white p-5">
        <Text className="text-base text-slate-700">Completed missions: {completedCount}</Text>
      </View>

      <Pressable className="mt-6 rounded-xl bg-slate-900 px-4 py-3" onPress={handleLogout}>
        <Text className="text-center font-semibold text-white">Logout</Text>
      </Pressable>
    </View>
  );
}

