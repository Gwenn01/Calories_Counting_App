export const CATEGORY_META: {
  [key: string]: { label: string; color: string; bg: string; border: string };
} = {
  push: {
    label: "Push",
    color: "#f97316",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  pull: {
    label: "Pull",
    color: "#3b82f6",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  legs: {
    label: "Legs",
    color: "#8b5cf6",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  full_body: {
    label: "Full Body",
    color: "#10b981",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },

  anterior: {
    label: "Anterior",
    color: "#ec4899",
    bg: "bg-pink-50",
    border: "border-pink-200",
  },

  posterior: {
    label: "Posterior",
    color: "#6366f1",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },
};

export const getCategoryMeta = (category: string) =>
  CATEGORY_META[category] ?? {
    label: category,
    color: "#64748b",
    bg: "bg-slate-50",
    border: "border-slate-200",
  };

export const formatDuration = (mins: number) => {
  if (mins < 60) return `${mins}m`;

  const h = Math.floor(mins / 60);
  const m = mins % 60;

  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};
