import { Macros } from "@/types/macros";
import { DAILY_MACRO_TARGETS } from "@/constants/macros";

export function useMacros(consumed: Macros) {
  const getPercent = (key: keyof Macros) => {
    return Math.min(
      Math.round((consumed[key] / DAILY_MACRO_TARGETS[key]) * 100),
      100,
    );
  };

  return {
    targets: DAILY_MACRO_TARGETS,
    consumed,
    getPercent,
  };
}
