import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, FlatList, Text, TextInput, View } from "react-native";

import { MissionCard } from "@/src/components/mission-card";
import { ErrorPanel, LoadingPanel } from "@/src/components/state-panels";
import { categoryOptions } from "@/src/constants/missions";
import { useAuth } from "@/src/context/auth-context";
import { useMissionMutations, useMissionsQuery } from "@/src/hooks/use-missions";
import type { MissionFilter, MissionView } from "@/src/types/models";
import { getErrorMessage } from "@/src/utils/errors";

const normalize = (value: string): string => value.trim().toLowerCase();

const isMissionFilter = (value: string): value is MissionFilter =>
  value === "all" || value === "cleanup" || value === "planting" || value === "education";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const missionsQuery = useMissionsQuery(user?.id);
  const { registerMutation, unregisterMutation } = useMissionMutations(user?.id);

  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState<MissionFilter>("all");

  // 1) Filter missions by search text and selected category.
  const filteredMissions = useMemo(() => {
    const missions = missionsQuery.data ?? [];
    const query = normalize(searchText);

    return missions.filter((mission) => {
      const matchesCategory = category === "all" || mission.category === category;
      const matchesText =
        query.length === 0 ||
        normalize(mission.title).includes(query) ||
        normalize(mission.description).includes(query) ||
        normalize(mission.location).includes(query);

      return matchesCategory && matchesText;
    });
  }, [category, missionsQuery.data, searchText]);

  // 2) Join or cancel participation (optimistic update is in the hook).
  const handleToggleMission = (mission: MissionView): void => {
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

  if (missionsQuery.isLoading) {
    return <LoadingPanel label="Loading missions..." />;
  }

  if (missionsQuery.isError) {
    return <ErrorPanel label={getErrorMessage(missionsQuery.error, "Could not load missions.")} onRetry={() => void missionsQuery.refetch()} />;
  }

  return (
    <View className="flex-1 bg-emerald-50 px-4 pt-4">
      <Text className="text-2xl font-bold text-slate-900">Home</Text>
      <Text className="mb-3 mt-1 text-sm text-slate-600">Find and join eco missions.</Text>

      {/* Search field */}
      <TextInput
        autoCapitalize="none"
        className="mb-3 rounded-xl border border-emerald-100 bg-white px-4 py-3 text-base text-slate-900"
        onChangeText={setSearchText}
        placeholder="Search missions"
        value={searchText}
      />

      {/* Category dropdown */}
      <View className="overflow-hidden rounded-xl border border-emerald-100 bg-white">
        <Picker
          selectedValue={category}
          onValueChange={(itemValue: string | number) => {
            if (typeof itemValue === "string" && isMissionFilter(itemValue)) {
              setCategory(itemValue);
            }
          }}
        >
          {categoryOptions.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>

      <FlatList
        className="mt-4"
        contentContainerStyle={{ paddingBottom: 120 }}
        data={filteredMissions}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View className="rounded-2xl border border-emerald-100 bg-white p-5">
            <Text className="text-center text-slate-600">No mission found.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isLoadingAction =
            (registerMutation.isPending && registerMutation.variables?.missionId === item.id) ||
            (unregisterMutation.isPending && unregisterMutation.variables?.missionId === item.id);

          return (
            <MissionCard
              isLoadingAction={isLoadingAction}
              mission={item}
              onOpen={(missionId) => router.push({ pathname: "/mission/[id]", params: { id: missionId } })}
              onToggleRegistration={handleToggleMission}
            />
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
