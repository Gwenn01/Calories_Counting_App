export type FoodItem = {
  id: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
};

export interface Food {
  id: number;

  // General
  name: string;
  serving: string;
  calories: number;
  water: number;

  // Protein
  protein: number;

  // Carbohydrates
  total_carbs: number;
  sugars: number;
  fiber: number;
  starch: number;

  // Fats
  total_fat: number;
  saturated_fat: number;
  monounsaturated_fat: number;
  polyunsaturated_fat: number;
  trans_fat: number;
  cholesterol: number;

  // Vitamins
  vitamin_a: number;
  vitamin_c: number;
  vitamin_e: number;
  vitamin_k: number;
  vitamin_b1: number;
  vitamin_b2: number;
  vitamin_b3: number;
  vitamin_b6: number;
  vitamin_b9: number;
  vitamin_b12: number;

  // Minerals
  calcium: number;
  iron: number;
  magnesium: number;
  phosphorus: number;
  potassium: number;
  sodium: number;
  zinc: number;
  copper: number;
  manganese: number;
}
