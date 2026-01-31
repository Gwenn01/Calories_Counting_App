import { create } from "zustand";

export type Macros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type MacroState = {
  consumed: Macros;
  targets: Macros;

  addFood: (food: Macros) => void;
  resetDay: () => void;
  updateTargets: (targets: Macros) => void;
};

export const useMacroStore = create<MacroState>((set) => ({
  consumed: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  },

  targets: {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 70,
  },

  addFood: (food) =>
    set((state) => ({
      consumed: {
        calories: state.consumed.calories + food.calories,
        protein: state.consumed.protein + food.protein,
        carbs: state.consumed.carbs + food.carbs,
        fat: state.consumed.fat + food.fat,
      },
    })),

  resetDay: () =>
    set({
      consumed: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      },
    }),

  updateTargets: (targets) => set({ targets }),
}));
