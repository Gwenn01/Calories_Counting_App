// home header
export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const CATEGORY_COLORS: Record<string, string> = {
  push: "#38bdf8",
  pull: "#a78bfa",
  legs: "#34d399",
  cardio: "#fb923c",
  chest: "#f472b6",
  back: "#facc15",
  anterior: "#22c55e",
  posterior: "#ef4444",
  rest: "#94a3b8",
};

export const CATEGORY_ICONS: Record<string, string> = {
  push: "trending-up",
  pull: "trending-down",
  legs: "activity",
  cardio: "wind",
  chest: "heart",
  back: "layers",
  anterior: "move",
  posterior: "rotate-ccw",
  rest: "moon",
};

// workout card
export const MOOD_LABELS: Record<number, string> = {
  1: "Awful",
  2: "Bad",
  3: "Poor",
  4: "Meh",
  5: "Okay",
  6: "Fine",
  7: "Good",
  8: "Great",
  9: "Amazing",
  10: "Perfect",
};
