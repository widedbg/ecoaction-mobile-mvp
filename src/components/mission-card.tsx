import { Pressable, Text, View } from "react-native";

import { categoryLabels } from "@/src/constants/missions";
import type { MissionView } from "@/src/types/models";
import { formatMissionDate } from "@/src/utils/date";

interface MissionCardProps {
  mission: MissionView;
  isLoadingAction?: boolean;
  onOpen: (missionId: string) => void;
  onToggleRegistration: (mission: MissionView) => void;
}

export const MissionCard = ({ mission, isLoadingAction, onOpen, onToggleRegistration }: MissionCardProps) => (
  <View className="mb-4 rounded-2xl border border-emerald-100 bg-white p-4">
    <Pressable onPress={() => onOpen(mission.id)}>
      <Text className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
        {categoryLabels[mission.category]}
      </Text>
      <Text className="mt-1 text-lg font-bold text-slate-900">{mission.title}</Text>
      <Text className="mt-2 text-sm text-slate-700">{mission.description}</Text>
      <View className="mt-3 gap-1">
        <Text className="text-sm text-slate-700">Date: {formatMissionDate(mission.date)}</Text>
        <Text className="text-sm text-slate-700">Location: {mission.location}</Text>
        <Text className="text-sm text-slate-700">Spots left: {mission.remainingSpots}</Text>
      </View>
    </Pressable>

    <Pressable
      className={`mt-4 rounded-xl px-4 py-3 ${mission.isRegistered ? "bg-slate-200" : "bg-emerald-600"}`}
      disabled={isLoadingAction || (!mission.isRegistered && mission.remainingSpots <= 0)}
      onPress={() => onToggleRegistration(mission)}
    >
      <Text className={`text-center font-semibold ${mission.isRegistered ? "text-slate-900" : "text-white"}`}>
        {isLoadingAction
          ? "Saving..."
          : mission.isRegistered
            ? "Cancel Participation"
            : mission.remainingSpots <= 0
              ? "Mission Full"
              : "Join Mission"}
      </Text>
    </Pressable>
  </View>
);
