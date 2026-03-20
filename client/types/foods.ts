// food item fetch
export type FoodItem = {
  id: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
};

// input foods
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

// ─── Types ────────────────────────────────────────────────────────
// chat boot
export interface NutritionForm {
  name: string;
  serving: string;
  calories: string;
  water: string;
  total_fat: string;
  saturated_fat: string;
  monounsaturated_fat: string;
  polyunsaturated_fat: string;
  cholesterol: string;
  total_carbs: string;
  starch: string;
  sugars: string;
  fiber: string;
  protein: string;
  vitamin_a: string;
  vitamin_c: string;
  vitamin_e: string;
  vitamin_k: string;
  thiamin_b1: string;
  riboflavin_b2: string;
  niacin_b3: string;
  vitamin_b6: string;
  folate_b9: string;
  calcium: string;
  iron: string;
  magnesium: string;
  phosphorus: string;
  potassium: string;
  sodium: string;
  zinc: string;
  copper: string;
  manganese: string;
}

export interface ChatMessage {
  role: "user" | "bot";
  text: string;
}
