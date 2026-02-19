import type { MissionCategory, MissionFilter } from "@/src/types/models";

export const categoryOptions: { value: MissionFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "cleanup", label: "Cleanup" },
  { value: "planting", label: "Tree Planting" },
  { value: "education", label: "Education" },
];

export const categoryLabels: Record<MissionCategory, string> = {
  cleanup: "Cleanup",
  planting: "Tree Planting",
  education: "Education",
};
