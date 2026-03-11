import { MacroData } from "@/types/macros";

export const NUTRIENTS: {
  key: keyof MacroData;
  label: string;
  unit: string;
}[] = [
  { key: "protein", label: "Protein", unit: "g" },
  { key: "carbs", label: "Carbohydrates", unit: "g" },
  { key: "fats", label: "Total Fat", unit: "g" },
  { key: "fiber", label: "Dietary Fiber", unit: "g" },
  { key: "sugar", label: "Sugars", unit: "g" },

  { key: "saturated_fat", label: "Saturated Fat", unit: "g" },
  { key: "monounsaturated_fat", label: "Monounsaturated Fat", unit: "g" },
  { key: "polyunsaturated_fat", label: "Polyunsaturated Fat", unit: "g" },
  { key: "trans_fat", label: "Trans Fat", unit: "g" },

  { key: "cholesterol", label: "Cholesterol", unit: "mg" },
  { key: "sodium", label: "Sodium", unit: "mg" },

  { key: "vitamin_a", label: "Vitamin A", unit: "µg" },
  { key: "vitamin_c", label: "Vitamin C", unit: "mg" },
  { key: "vitamin_d", label: "Vitamin D", unit: "µg" },
  { key: "vitamin_e", label: "Vitamin E", unit: "mg" },
  { key: "vitamin_k", label: "Vitamin K", unit: "µg" },

  { key: "vitamin_b1", label: "Vitamin B1", unit: "mg" },
  { key: "vitamin_b2", label: "Vitamin B2", unit: "mg" },
  { key: "vitamin_b3", label: "Vitamin B3", unit: "mg" },
  { key: "vitamin_b6", label: "Vitamin B6", unit: "mg" },
  { key: "vitamin_b9", label: "Vitamin B9", unit: "µg" },
  { key: "vitamin_b12", label: "Vitamin B12", unit: "µg" },

  { key: "calcium", label: "Calcium", unit: "mg" },
  { key: "iron", label: "Iron", unit: "mg" },
  { key: "magnesium", label: "Magnesium", unit: "mg" },
  { key: "phosphorus", label: "Phosphorus", unit: "mg" },
  { key: "potassium", label: "Potassium", unit: "mg" },
  { key: "zinc", label: "Zinc", unit: "mg" },
  { key: "copper", label: "Copper", unit: "mg" },
  { key: "manganese", label: "Manganese", unit: "mg" },
];
