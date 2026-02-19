import { apiRequest } from "@/src/api/http";
import type { Mission, MissionView, Registration } from "@/src/types/models";

const toMissionView = (mission: Mission, registrations: Registration[], userId: string): MissionView => {
  const missionRegistrations = registrations.filter((item) => item.missionId === mission.id);
  const myRegistration = missionRegistrations.find((item) => item.userId === userId);

  return {
    ...mission,
    registeredCount: missionRegistrations.length,
    remainingSpots: Math.max(0, mission.totalSpots - missionRegistrations.length),
    isRegistered: Boolean(myRegistration),
    registrationId: myRegistration?.id,
  };
};

export const getMissionsApi = async (userId: string): Promise<MissionView[]> => {
  const [missions, registrations] = await Promise.all([
    apiRequest<Mission[]>("/missions"),
    apiRequest<Registration[]>("/registrations"),
  ]);

  return missions
    .map((mission) => toMissionView(mission, registrations, userId))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const joinMissionApi = async (userId: string, missionId: string): Promise<Registration> => {
  const [myRegistrations, missionRegistrations, mission] = await Promise.all([
    apiRequest<Registration[]>("/registrations", { method: "GET" }, { userId, missionId }),
    apiRequest<Registration[]>("/registrations", { method: "GET" }, { missionId }),
    apiRequest<Mission>(`/missions/${missionId}`),
  ]);

  if (myRegistrations.length > 0) {
    throw new Error("You already joined this mission.");
  }

  if (missionRegistrations.length >= mission.totalSpots) {
    throw new Error("No spots left.");
  }

  const registration: Registration = {
    id: `reg-${Date.now()}-${Math.floor(Math.random() * 10_000)}`,
    userId,
    missionId,
    createdAt: new Date().toISOString(),
  };

  return apiRequest<Registration>("/registrations", {
    method: "POST",
    body: JSON.stringify(registration),
  });
};

export const cancelMissionApi = async (registrationId: string): Promise<void> => {
  await apiRequest<Registration>(`/registrations/${registrationId}`, { method: "DELETE" });
};
