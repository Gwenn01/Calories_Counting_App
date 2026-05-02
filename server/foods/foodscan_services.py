from google import genai
import json
import logging
import os
from pathlib import Path

logger = logging.getLogger(__name__)

from google import genai
import json
import logging
import os
from pathlib import Path

logger = logging.getLogger(__name__)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class FoodScanServices:

    SUPPORTED_FORMATS = {
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "png": "image/png",
        "gif": "image/gif",
        "webp": "image/webp",
    }

    ANALYSIS_PROMPT = """
You are a professional nutritionist and food recognition expert.

Analyze the food in this image and return a JSON object ONLY — no explanation, no markdown, no backticks.

The JSON must follow this exact structure:
{
  "food_name": "string",
  "estimated_serving": "string",
  "confidence": "high | medium | low",
  "nutrition_per_serving": {
    "calories": 0,
    "water": 0,
    "total_fat": 0,
    "saturated_fat": 0,
    "monounsaturated_fat": 0,
    "polyunsaturated_fat": 0,
    "trans_fat": 0,
    "cholesterol": 0,
    "total_carbs": 0,
    "fiber": 0,
    "sugars": 0,
    "starch": 0,
    "protein": 0,
    "vitamin_a": 0,
    "vitamin_c": 0,
    "vitamin_e": 0,
    "vitamin_k": 0,
    "vitamin_b1": 0,
    "vitamin_b2": 0,
    "vitamin_b3": 0,
    "vitamin_b6": 0,
    "vitamin_b9": 0,
    "vitamin_b12": 0,
    "calcium": 0,
    "iron": 0,
    "magnesium": 0,
    "phosphorus": 0,
    "potassium": 0,
    "sodium": 0,
    "zinc": 0,
    "copper": 0,
    "manganese": 0
  },
  "notes": "string"
}

Rules:
- All numeric values are per the estimated serving shown in the image
- Use 0 for nutrients you cannot reasonably estimate
- If you cannot identify the food at all, still return valid JSON with food_name set to "Unknown" and confidence "low"
- Return ONLY the JSON — no other text
"""

    @staticmethod
    def _get_media_type(image_file) -> str:
        if hasattr(image_file, 'content_type') and image_file.content_type:
            return image_file.content_type

        name = getattr(image_file, 'name', '') or ''
        ext = Path(name).suffix.lstrip('.').lower()

        return FoodScanServices.SUPPORTED_FORMATS.get(ext, "image/jpeg")

    @staticmethod
    def analyze_food_image(image_file) -> dict | None:
        try:
            image_file.seek(0)
            image_bytes = image_file.read()

            if not image_bytes:
                logger.error("[FoodScan] Empty image file received.")
                return None

            mime_type = FoodScanServices._get_media_type(image_file)

            #  FIX: Use gemini-2.0-flash — stable, supports vision, fast

            logger.debug("[FoodScan] Sending image to Gemini...")

            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=[
                    {
                        "role": "user",
                        "parts": [
                            {
                                "inline_data": {
                                    "mime_type": mime_type,
                                    "data": image_bytes
                                }
                            },
                            {
                                "text": FoodScanServices.ANALYSIS_PROMPT
                            }
                        ]
                    }
                ]
            )

            raw_text = response.candidates[0].content.parts[0].text.strip()
            logger.debug(f"[FoodScan] Raw response: {raw_text}")

            # Strip markdown fences if Gemini wraps it anyway
            if raw_text.startswith("```"):
                raw_text = raw_text.split("```")[1]
                if raw_text.startswith("json"):
                    raw_text = raw_text[4:]
                raw_text = raw_text.strip()

            data = json.loads(raw_text)
            nutrition = data.get("nutrition_per_serving", {})

            return {
                "name": data.get("food_name", "Unknown"),
                "serving": data.get("estimated_serving", ""),
                "confidence": data.get("confidence", "low"),
                "notes": data.get("notes", ""),
                "source": "Gemini Vision",
                # Energy
                "calories": nutrition.get("calories") or 0,
                "water": nutrition.get("water") or 0,
                # Fats
                "total_fat": nutrition.get("total_fat") or 0,
                "saturated_fat": nutrition.get("saturated_fat") or 0,
                "monounsaturated_fat": nutrition.get("monounsaturated_fat") or 0,
                "polyunsaturated_fat": nutrition.get("polyunsaturated_fat") or 0,
                "trans_fat": nutrition.get("trans_fat") or 0,
                "cholesterol": nutrition.get("cholesterol") or 0,
                # Carbs
                "total_carbs": nutrition.get("total_carbs") or 0,
                "fiber": nutrition.get("fiber") or 0,
                "sugars": nutrition.get("sugars") or 0,
                "starch": nutrition.get("starch") or 0,
                # Protein
                "protein": nutrition.get("protein") or 0,
                # Vitamins
                "vitamin_a": nutrition.get("vitamin_a") or 0,
                "vitamin_c": nutrition.get("vitamin_c") or 0,
                "vitamin_e": nutrition.get("vitamin_e") or 0,
                "vitamin_k": nutrition.get("vitamin_k") or 0,
                "vitamin_b1": nutrition.get("vitamin_b1") or 0,
                "vitamin_b2": nutrition.get("vitamin_b2") or 0,
                "vitamin_b3": nutrition.get("vitamin_b3") or 0,
                "vitamin_b6": nutrition.get("vitamin_b6") or 0,
                "vitamin_b9": nutrition.get("vitamin_b9") or 0,
                "vitamin_b12": nutrition.get("vitamin_b12") or 0,
                # Minerals
                "calcium": nutrition.get("calcium") or 0,
                "iron": nutrition.get("iron") or 0,
                "magnesium": nutrition.get("magnesium") or 0,
                "phosphorus": nutrition.get("phosphorus") or 0,
                "potassium": nutrition.get("potassium") or 0,
                "sodium": nutrition.get("sodium") or 0,
                "zinc": nutrition.get("zinc") or 0,
                "copper": nutrition.get("copper") or 0,
                "manganese": nutrition.get("manganese") or 0,
            }

        except json.JSONDecodeError as e:
            logger.error(f"[FoodScan] Failed to parse Gemini response as JSON: {e}")
        except Exception as e:
            logger.error(f"[FoodScan] Unexpected error: {e}")

        return None