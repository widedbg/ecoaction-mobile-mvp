import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { cancelMissionApi, getMissionsApi, joinMissionApi } from "@/src/api/missions-api";
import type { MissionView } from "@/src/types/models";

interface RegisterInput {
  missionId: string;
}

interface UnregisterInput {
  missionId: string;
  registrationId: string;
}

interface RollbackContext {
  previousMissions?: MissionView[];
}

const withRegistered = (mission: MissionView, registrationId: string): MissionView => ({
  ...mission,
  isRegistered: true,
  registrationId,
  registeredCount: mission.registeredCount + 1,
  remainingSpots: Math.max(0, mission.remainingSpots - 1),
});

const withUnregistered = (mission: MissionView): MissionView => ({
  ...mission,
  isRegistered: false,
  registrationId: undefined,
  registeredCount: Math.max(0, mission.registeredCount - 1),
  remainingSpots: mission.remainingSpots + 1,
});

const missionsKey = (userId: string | undefined) => ["missions", userId ?? "guest"] as const;

export const useMissionsQuery = (userId: string | undefined) =>
  useQuery({
    // Query missions as if from a remote API.
    queryKey: missionsKey(userId),
    queryFn: () => getMissionsApi(userId ?? ""),
    enabled: Boolean(userId),
  });

export const useMissionMutations = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  const queryKey = missionsKey(userId);

  const registerMutation = useMutation({
    mutationFn: ({ missionId }: RegisterInput) => {
      if (!userId) {
        return Promise.reject(new Error("You must be logged in."));
      }
      return joinMissionApi(userId, missionId);
    },
    onMutate: async ({ missionId }): Promise<RollbackContext> => {
      // Optimistic update: mark mission as joined immediately.
      await queryClient.cancelQueries({ queryKey });
      const previousMissions = queryClient.getQueryData<MissionView[]>(queryKey);

      queryClient.setQueryData<MissionView[]>(queryKey, (current) =>
        current?.map((mission) =>
          mission.id === missionId && !mission.isRegistered && mission.remainingSpots > 0
            ? withRegistered(mission, `temp-${Date.now()}`)
            : mission,
        ),
      );

      return { previousMissions };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousMissions);
    },
    onSuccess: (registration, { missionId }) => {
      queryClient.setQueryData<MissionView[]>(queryKey, (current) =>
        current?.map((mission) => (mission.id === missionId ? { ...mission, registrationId: registration.id } : mission)),
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  });

  const unregisterMutation = useMutation({
    mutationFn: ({ registrationId }: UnregisterInput) => cancelMissionApi(registrationId),
    onMutate: async ({ missionId }): Promise<RollbackContext> => {
      // Optimistic update: remove participation immediately.
      await queryClient.cancelQueries({ queryKey });
      const previousMissions = queryClient.getQueryData<MissionView[]>(queryKey);

      queryClient.setQueryData<MissionView[]>(queryKey, (current) =>
        current?.map((mission) => (mission.id === missionId && mission.isRegistered ? withUnregistered(mission) : mission)),
      );

      return { previousMissions };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousMissions);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  });

  return { registerMutation, unregisterMutation };
};
