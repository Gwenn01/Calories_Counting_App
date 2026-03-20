type NutrientMeta = {
  icon: string;
  color: string;
  bg: string;
  border: string;
};

export const NUTRIENT_META: Record<string, NutrientMeta> = {
  vitamin_c: {
    icon: "sun",
    color: "#38bdf8",
    bg: "#0c2a4a",
    border: "#1e3a5f",
  },
  vitamin_a: {
    icon: "eye",
    color: "#fbbf24",
    bg: "#2e1f0a",
    border: "#3a2a1e",
  },
  vitamin_d: {
    icon: "sun",
    color: "#fde68a",
    bg: "#2e280a",
    border: "#3a341e",
  },
  vitamin_e: {
    icon: "shield",
    color: "#4ade80",
    bg: "#0a2e1a",
    border: "#1e3a2d",
  },
  vitamin_k: {
    icon: "shield",
    color: "#a78bfa",
    bg: "#1a0a2e",
    border: "#2a1e3a",
  },
  vitamin_b1: {
    icon: "zap",
    color: "#fb923c",
    bg: "#2e1a0a",
    border: "#3a2a1e",
  },
  vitamin_b2: {
    icon: "zap",
    color: "#fb923c",
    bg: "#2e1a0a",
    border: "#3a2a1e",
  },
  vitamin_b3: {
    icon: "zap",
    color: "#fb923c",
    bg: "#2e1a0a",
    border: "#3a2a1e",
  },
  vitamin_b6: {
    icon: "zap",
    color: "#fb923c",
    bg: "#2e1a0a",
    border: "#3a2a1e",
  },
  vitamin_b9: {
    icon: "zap",
    color: "#fb923c",
    bg: "#2e1a0a",
    border: "#3a2a1e",
  },
  vitamin_b12: {
    icon: "zap",
    color: "#fb923c",
    bg: "#2e1a0a",
    border: "#3a2a1e",
  },
  calcium: {
    icon: "shield",
    color: "#4ade80",
    bg: "#1a2e0a",
    border: "#2d3a1e",
  },
  iron: {
    icon: "activity",
    color: "#fb923c",
    bg: "#2e1a0a",
    border: "#3a2a1e",
  },
  magnesium: {
    icon: "zap",
    color: "#a78bfa",
    bg: "#1a0a2e",
    border: "#2a1e3a",
  },
  phosphorus: {
    icon: "circle",
    color: "#38bdf8",
    bg: "#0c2a4a",
    border: "#1e3a5f",
  },
  potassium: {
    icon: "shield",
    color: "#34d399",
    bg: "#0a2e1a",
    border: "#1e3a2d",
  },
  zinc: { icon: "cpu", color: "#818cf8", bg: "#0f172a", border: "#1e2a5f" },
  copper: { icon: "cpu", color: "#f97316", bg: "#2e1a0a", border: "#3a2a1e" },
  manganese: {
    icon: "cpu",
    color: "#e879f9",
    bg: "#2a0a2e",
    border: "#3a1e3a",
  },
  sodium: { icon: "heart", color: "#f87171", bg: "#2e0a0a", border: "#3a1e1e" },
  cholesterol: {
    icon: "heart",
    color: "#f43f5e",
    bg: "#2e0a14",
    border: "#3a1e24",
  },
  fiber: { icon: "layers", color: "#86efac", bg: "#0a2e14", border: "#1e3a24" },
  sugar: {
    icon: "droplet",
    color: "#fca5a5",
    bg: "#2e0a0a",
    border: "#3a1e1e",
  },
};

export const FALLBACK_META = {
  icon: "circle",
  color: "#64748b",
  bg: "#1e293b",
  border: "#334155",
};
