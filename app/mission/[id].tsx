import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import { ErrorPanel, LoadingPanel } from "@/src/components/state-panels";
import { categoryLabels } from "@/src/constants/missions";
import { useAuth } from "@/src/context/auth-context";
import { useMissionMutations, useMissionsQuery } from "@/src/hooks/use-missions";
import { getErrorMessage } from "@/src/utils/errors";
import { formatMissionDate } from "@/src/utils/date";

export default function MissionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const missionsQuery = useMissionsQuery(user?.id);
  const { registerMutation, unregisterMutation } = useMissionMutations(user?.id);

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  if (missionsQuery.isLoading) {
    return <LoadingPanel label="Loading mission details..." />;
  }

  if (missionsQuery.isError) {
    return <ErrorPanel label={getErrorMessage(missionsQuery.error, "Could not load mission details.")} onRetry={() => void missionsQuery.refetch()} />;
  }

  const mission = missionsQuery.data?.find((item) => item.id === id);

  if (!mission) {
    return <ErrorPanel label="Mission not found." />;
  }

  const isSaving =
    (registerMutation.isPending && registerMutation.variables?.missionId === mission.id) ||
    (unregisterMutation.isPending && unregisterMutation.variables?.missionId === mission.id);

  const handleToggle = (): void => {
    if (mission.isRegistered && mission.registrationId) {
      unregisterMutation.mutate(
        { missionId: mission.id, registrationId: mission.registrationId },
        {
          onError: (error) => Alert.alert("Cancel failed", getErrorMessage(error)),
        },
      );
      return;
    }

    registerMutation.mutate(
      { missionId: mission.id },
      {
        onError: (error) => Alert.alert("Join failed", getErrorMessage(error)),
      },
    );
  };

  return (
    <ScrollView className="flex-1 bg-emerald-50" contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
      <Stack.Screen options={{ headerShown: true, title: "Mission Details", headerTintColor: "#065f46" }} />

      <View className="rounded-2xl border border-emerald-100 bg-white p-5">
        <Text className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{categoryLabels[mission.category]}</Text>
        <Text className="mt-1 text-2xl font-black text-slate-900">{mission.title}</Text>
        <Text className="mt-3 text-base leading-6 text-slate-700">{mission.description}</Text>

        <View className="mt-6 gap-2">
          <Text className="text-base text-slate-800">Date: {formatMissionDate(mission.date)}</Text>
          <Text className="text-base text-slate-800">Location: {mission.location}</Text>
          <Text className="text-base text-slate-800">Total spots: {mission.totalSpots}</Text>
          <Text className="text-base text-slate-800">Registered: {mission.registeredCount}</Text>
          <Text className="text-base text-slate-800">Remaining spots: {mission.remainingSpots}</Text>
        </View>
      </View>

      <Pressable
        className={`mt-5 rounded-xl px-4 py-4 ${mission.isRegistered ? "bg-slate-200" : "bg-emerald-600"}`}
        disabled={isSaving || (!mission.isRegistered && mission.remainingSpots <= 0)}
        onPress={handleToggle}
      >
        <Text className={`text-center text-base font-semibold ${mission.isRegistered ? "text-slate-900" : "text-white"}`}>
          {isSaving
            ? "Saving..."
            : mission.isRegistered
              ? "Cancel Participation"
              : mission.remainingSpots <= 0
                ? "Mission Full"
                : "Join Mission"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
