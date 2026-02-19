export type MissionCategory = "cleanup" | "planting" | "education";

export type MissionFilter = "all" | MissionCategory;

export interface Mission {
  id: string;
  title: string;
  category: MissionCategory;
  date: string;
  location: string;
  description: string;
  totalSpots: number;
}

export interface Registration {
  id: string;
  missionId: string;
  userId: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
}

export interface MissionView extends Mission {
  registeredCount: number;
  remainingSpots: number;
  isRegistered: boolean;
  registrationId?: string;
}
