import json
import os
import re
from google import genai
from google.genai import types
from dotenv import load_dotenv
load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


# =============================================================================
# ACCURACY TECHNIQUE 1 — PRE-PROCESS THE FOOD INPUT

# Unit conversion map to standardize everything to grams/ml
UNIT_CONVERSIONS = {
    "cup": 240, "cups": 240,
    "tbsp": 15, "tablespoon": 15, "tablespoons": 15,
    "tsp": 5, "teaspoon": 5, "teaspoons": 5,
    "oz": 28.35, "ounce": 28.35, "ounces": 28.35,
    "lb": 453.59, "pound": 453.59, "pounds": 453.59,
    "kg": 1000, "kilogram": 1000, "kilograms": 1000,
    "g": 1, "gram": 1, "grams": 1,
    "ml": 1, "milliliter": 1, "milliliters": 1,
    "l": 1000, "liter": 1000, "liters": 1000,
    "piece": None, "pieces": None, "pcs": None,  # None = keep as-is
    "slice": None, "slices": None,
    "serving": None, "servings": None,
}

def normalize_food_input(food: str) -> str:
    """
    ACCURACY TECHNIQUE 1: Clean and standardize food input before sending to AI.
    What it does:
    - Lowercases and strips whitespace
    - Expands abbreviations ("w/" → "with", "approx" → "approximately")
    - Converts known quantities + units to a standard format
    - Removes filler words that confuse the AI
    """
    food = food.strip().lower()

    # Expand common abbreviations
    abbreviations = {
        r"\bw/\b": "with",
        r"\bw/o\b": "without",
        r"\bapprox\.?\b": "approximately",
        r"\bveg\b": "vegetables",
        r"\bchix\b": "chicken",
        r"\bpcs\b": "pieces",
        r"\btbsp\b": "tablespoon",
        r"\btsp\b": "teaspoon",
    }
    for pattern, replacement in abbreviations.items():
        food = re.sub(pattern, replacement, food)

    # Convert fractions like "1/2" to decimals "0.5"
    food = re.sub(
        r"(\d+)\s*/\s*(\d+)",
        lambda m: str(round(int(m.group(1)) / int(m.group(2)), 2)),
        food
    )

    # Standardize quantity+unit combos (e.g., "200g" → "200 grams")
    for unit, _ in UNIT_CONVERSIONS.items():
        food = re.sub(rf"(\d+\.?\d*)\s*{unit}\b", rf"\1 {unit}", food)
    print(food.strip())
    return food.strip()


# =============================================================================
# ACCURACY TECHNIQUE 2 — EXTRACT STRUCTURED FOOD COMPONENTS FIRST
# Problem: "adobo with rice and 2 eggs" is ambiguous.
# Solution: Parse it into structured parts before sending to AI so it knows
# exactly what to calculate.
# =============================================================================

def extract_food_components(food: str) -> list[dict]:
    """
    ACCURACY TECHNIQUE 2: Split compound food inputs into individual components.

    Example:
        "2 cups rice with lechon kawali 200 grams and 1 egg"
        → [
            {"item": "rice", "quantity": "2", "unit": "cups"},
            {"item": "lechon kawali", "quantity": "200", "unit": "grams"},
            {"item": "egg", "quantity": "1", "unit": "piece"},
          ]
    This gives the AI a clean, structured breakdown instead of parsing free text.
    """
    # Match patterns like "2 cups rice", "200g lechon", "1 egg"
    pattern = r"(\d+\.?\d*)\s*(cup|cups|tbsp|tsp|g|grams|kg|oz|lb|ml|l|pieces?|pcs|slices?|servings?)?\s*([a-zA-Z\s]+?)(?=\s*(?:and|with|,|$))"
    matches = re.findall(pattern, food, re.IGNORECASE)

    components = []
    for qty, unit, item in matches:
        components.append({
            "item": item.strip(),
            "quantity": qty or "1",
            "unit": unit.strip() if unit else "serving"
        })

    # Fallback: if no structured match, return the whole string as one item
    if not components:
        components = [{"item": food, "quantity": "1", "unit": "serving"}]
    print(components)
    return components


# =============================================================================
# ACCURACY TECHNIQUE 3 — FEW-SHOT EXAMPLES IN THE PROMPT
# Problem: Zero-shot prompts ("analyze this food") give inconsistent results.
# Solution: Show the AI 1-2 examples of exactly what you expect. This is the
# single biggest accuracy boost for structured JSON output.
# =============================================================================

FEW_SHOT_EXAMPLE = """
EXAMPLE INPUT:
Food: 1 cup cooked white rice (186 grams)

EXAMPLE OUTPUT:
{
  "name": "Cooked White Rice",
  "serving": "186g (1 cup)",
  "calories": 242,
  "water": 108.2,
  "total_fat": 0.4,
  "saturated_fat": 0.1,
  "monounsaturated_fat": 0.1,
  "polyunsaturated_fat": 0.1,
  "cholesterol": 0,
  "total_carbs": 53.4,
  "starch": 52.0,
  "sugars": 0.1,
  "fiber": 0.6,
  "protein": 4.4,
  "vitamin_a": 0,
  "vitamin_c": 0,
  "vitamin_e": 0.0,
  "vitamin_k": 0.0,
  "thiamin_b1": 0.26,
  "riboflavin_b2": 0.02,
  "niacin_b3": 2.33,
  "vitamin_b6": 0.15,
  "folate_b9": 4.0,
  "calcium": 15.8,
  "iron": 1.9,
  "magnesium": 19.0,
  "phosphorus": 68.0,
  "potassium": 55.0,
  "sodium": 1.9,
  "zinc": 0.77,
  "copper": 0.07,
  "manganese": 0.95
}
"""


# =============================================================================
# ACCURACY TECHNIQUE 4 — CHAIN-OF-THOUGHT PROMPT STRUCTURE
# Problem: Asking the AI to "just return JSON" skips its reasoning.
# Solution: Ask it to THINK first (ingredient breakdown, weight estimates),
# then output the final JSON. This mimics how a nutritionist would work.
# =============================================================================

def build_prompt(food: str, components: list[dict]) -> str:
    components_str = "\n".join(
        f"  - {c['quantity']} {c['unit']} of {c['item']}"
        for c in components
    )

    return f"""
        You are a professional nutritionist and food scientist with expertise in food composition databases (USDA, NCCDB, Philippine Food Composition Table).

        {FEW_SHOT_EXAMPLE}

        ---

        Now analyze the following food. Follow these steps in your thinking:

        STEP 1 - IDENTIFY: List each food component with its estimated weight in grams.
        STEP 2 - LOOK UP: For each component, recall its nutritional values per 100g from standard food composition databases.
        STEP 3 - CALCULATE: Multiply each value by the actual weight and sum all components.
        STEP 4 - OUTPUT: Return ONLY the final JSON result. No explanation, no markdown, no code fences.

        Pre-parsed components:
        {components_str}

        Original input: {food}

        CRITICAL RULES:
        - All nutrient values must be NUMBERS (not strings)
        - Serving size must be in grams (e.g., "350g")
        - If a nutrient is truly zero or trace, use 0
        - Do NOT include any text before or after the JSON
        - Do NOT wrap in ```json``` or any markdown

        Return the JSON now:
        """





# =============================================================================
# FINAL CLASS — EVERYTHING COMBINED
# =============================================================================

class FoodBotServices:
    
    @staticmethod
    def validate_and_sanitize(data: dict) -> dict:
        """
        ACCURACY TECHNIQUE 5: Validate and fix common AI output issues.

        Checks:
        - All required fields are present (fills missing ones with 0)
        - All numeric fields are actually numbers (converts strings if needed)
        - No negative values (clamps to 0)
        - Reasonable calorie range sanity check
        """
        REQUIRED_FIELDS = [
            "name", "serving", "calories", "water", "total_fat", "saturated_fat",
            "monounsaturated_fat", "polyunsaturated_fat", "cholesterol", "total_carbs",
            "starch", "sugars", "fiber", "protein", "vitamin_a", "vitamin_c",
            "vitamin_e", "vitamin_k", "thiamin_b1", "riboflavin_b2", "niacin_b3",
            "vitamin_b6", "folate_b9", "calcium", "iron", "magnesium", "phosphorus",
            "potassium", "sodium", "zinc", "copper", "manganese"
        ]
        sanitized = {}

        for field in REQUIRED_FIELDS:
            value = data.get(field, 0)

            if field in ("name", "serving"):
                sanitized[field] = str(value) if value else "Unknown"
                continue

            # Try to convert to float
            try:
                numeric = float(str(value).replace(",", "").strip())
            except (ValueError, TypeError):
                numeric = 0.0

            # Clamp negatives to 0
            sanitized[field] = max(0.0, round(numeric, 2))

        # Sanity check: calories shouldn't be over 10,000 for a single serving
        if sanitized.get("calories", 0) > 10000:
            raise ValueError(
                f"Suspicious calorie value: {sanitized['calories']}. "
                "Check the input — it may describe an unreasonably large quantity."
            )

        return sanitized


    @staticmethod
    def get_nutrition_data(food: str) -> dict:
        """
        Get accurate nutrition data for any food input.

        Accuracy pipeline:
        1. Normalize input (clean abbreviations, units)
        2. Extract structured components
        3. Build chain-of-thought prompt with few-shot example
        4. Call Gemini 2.0 Flash with JSON mode enforced
        5. Validate and sanitize the output
        """

        # Step 1: Normalize
        clean_food = normalize_food_input(food)

        # Step 2: Extract components
        components = extract_food_components(clean_food)

        # Step 3: Build prompt
        prompt = build_prompt(clean_food, components)

        # Step 4: Call Gemini
        response = client.models.generate_content(
            model="gemini-2.5-flash",       # or "gemini-2.5-flash" for latest
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",  # enforces valid JSON
                temperature=0,                          # 0 = most deterministic
            ),
        )
        print("STATUS:", response)
        raw = response.text
        print("RAW RESPONSE:", raw)
        # Step 5: Parse + validate
        try:
            data = json.loads(raw)
            print("PARSED DATA:", json.dumps(data, indent=2))
        except json.JSONDecodeError:
            # Sometimes AI adds a trailing comment — strip and retry
            cleaned = re.sub(r"//.*|/\*[\s\S]*?\*/", "", raw).strip()
            try:
                data = json.loads(cleaned)
            except json.JSONDecodeError:
                raise ValueError(f"Could not parse AI response as JSON:\n{raw}")

        return FoodBotServices.validate_and_sanitize(data)


# =============================================================================
# QUICK TEST
if __name__ == "__main__":
    test_foods = [
        "100g chicken adobo legs part",
    ]

    for food in test_foods:
        print(f"\n{'='*60}")
        print(f"Input:  {food}")
        print(f"{'='*60}")
        try:
            result = FoodBotServices.get_nutrition_data(food)
            print(f"Name:     {result['name']}")
            print(f"Serving:  {result['serving']}")
            print(f"Calories: {result['calories']} kcal")
            print(f"Protein:  {result['protein']}g")
            print(f"Carbs:    {result['total_carbs']}g")
            print(f"Fat:      {result['total_fat']}g")
        except Exception as e:
            print(f"Error: {e}")