export const formatMissionDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const isPastDate = (isoDate: string): boolean => {
  const date = new Date(isoDate);
  return date.getTime() < Date.now();
};
