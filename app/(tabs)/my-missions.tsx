import { Alert, FlatList, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { MissionCard } from "@/src/components/mission-card";
import { ErrorPanel, LoadingPanel } from "@/src/components/state-panels";
import { useAuth } from "@/src/context/auth-context";
import { useMissionMutations, useMissionsQuery } from "@/src/hooks/use-missions";
import type { MissionView } from "@/src/types/models";
import { getErrorMessage } from "@/src/utils/errors";

export default function MyMissionsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const missionsQuery = useMissionsQuery(user?.id);
  const { unregisterMutation } = useMissionMutations(user?.id);

  if (missionsQuery.isLoading) {
    return <LoadingPanel label="Loading your missions..." />;
  }

  if (missionsQuery.isError) {
    return <ErrorPanel label={getErrorMessage(missionsQuery.error, "Could not load your missions.")} onRetry={() => void missionsQuery.refetch()} />;
  }

  const myMissions = (missionsQuery.data ?? []).filter((mission) => mission.isRegistered);

  const handleUnregister = (mission: MissionView): void => {
    if (!mission.registrationId) {
      return;
    }

    unregisterMutation.mutate(
      { missionId: mission.id, registrationId: mission.registrationId },
      {
        onError: (error) => Alert.alert("Cancel failed", getErrorMessage(error)),
      },
    );
  };

  return (
    <View className="flex-1 bg-emerald-50 px-4 pt-4">
      <Text className="mb-4 text-2xl font-bold text-slate-900">My Missions</Text>

      <FlatList
        contentContainerStyle={{ paddingBottom: 120 }}
        data={myMissions}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View className="rounded-2xl border border-emerald-100 bg-white p-5">
            <Text className="text-center text-slate-600">You have not joined any mission yet.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isLoadingAction = unregisterMutation.isPending && unregisterMutation.variables?.missionId === item.id;
          return (
            <MissionCard
              isLoadingAction={isLoadingAction}
              mission={item}
              onOpen={(missionId) => router.push({ pathname: "/mission/[id]", params: { id: missionId } })}
              onToggleRegistration={handleUnregister}
            />
          );
        }}
      />
    </View>
  );
}

