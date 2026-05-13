export const CATEGORY_COLORS: Record<string, string> = {
  push: "#f97316",
  pull: "#3b82f6",
  legs: "#8b5cf6",
  full_body: "#10b981",
};

export const MUSCLE_COLORS: Record<string, string> = {
  chest: "#f97316",
  back: "#3b82f6",
  legs: "#8b5cf6",
  shoulders: "#10b981",
  biceps: "#f59e0b",
  triceps: "#ef4444",
  core: "#06b6d4",
};

export const formatDuration = (seconds: number | null) => {
  if (!seconds) return "In progress";
  const m = Math.floor(seconds / 60);
  const h = Math.floor(m / 60);
  return h > 0 ? `${h}h ${m % 60}m` : `${m}m`;
};

export const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
