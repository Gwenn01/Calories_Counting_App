export type Macros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};
export type MacroKey = keyof Macros;

export type MacroData = {
  id: number;
  date: string;

  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;

  saturated_fat: number;
  monounsaturated_fat: number;
  polyunsaturated_fat: number;
  trans_fat: number;

  cholesterol: number;
  sodium: number;

  vitamin_a: number;
  vitamin_c: number;
  vitamin_d: number;
  vitamin_e: number;
  vitamin_k: number;

  vitamin_b1: number;
  vitamin_b2: number;
  vitamin_b3: number;
  vitamin_b6: number;
  vitamin_b9: number;
  vitamin_b12: number;

  calcium: number;
  iron: number;
  magnesium: number;
  phosphorus: number;
  potassium: number;
  zinc: number;
  copper: number;
  manganese: number;
};
