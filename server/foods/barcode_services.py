import requests
import logging

logger = logging.getLogger(__name__)


class BarcodeServices:

    @staticmethod
    def fetch_from_open_food_facts(barcode: str) -> dict | None:
        # ✅ FIX: Try "world" first (broader coverage), then "ph" as fallback
        for subdomain in ["world", "ph"]:
            try:
                url = f"https://{subdomain}.openfoodfacts.org/api/v0/product/{barcode}.json"
                logger.debug(f"[OpenFoodFacts] Trying {url}")

                response = requests.get(url, timeout=10)
                response.raise_for_status()
                data = response.json()

                if data.get("status") != 1:
                    logger.warning(f"[OpenFoodFacts] Product not found on '{subdomain}' for barcode: {barcode}")
                    continue

                product = data.get("product", {})
                n = product.get("nutriments", {})

                logger.info(f"[OpenFoodFacts] Found product via '{subdomain}': {product.get('product_name', 'Unknown')}")

                return {
                    "name": product.get("product_name", ""),
                    "serving": product.get("serving_size", ""),
                    # Energy
                    "calories": n.get("energy-kcal_100g") or 0,
                    "water": n.get("water_100g") or 0,
                    # Fats
                    "total_fat": n.get("fat_100g") or 0,
                    "saturated_fat": n.get("saturated-fat_100g") or 0,
                    "monounsaturated_fat": n.get("monounsaturated-fat_100g") or 0,
                    "polyunsaturated_fat": n.get("polyunsaturated-fat_100g") or 0,
                    "trans_fat": n.get("trans-fat_100g") or 0,
                    "cholesterol": n.get("cholesterol_100g") or 0,
                    # Carbs
                    "total_carbs": n.get("carbohydrates_100g") or 0,
                    "fiber": n.get("fiber_100g") or 0,
                    "sugars": n.get("sugars_100g") or 0,
                    "starch": n.get("starch_100g") or 0,
                    # Protein
                    "protein": n.get("proteins_100g") or 0,
                    # Vitamins
                    "vitamin_a": n.get("vitamin-a_100g") or 0,
                    "vitamin_c": n.get("vitamin-c_100g") or 0,
                    "vitamin_e": n.get("vitamin-e_100g") or 0,
                    "vitamin_k": n.get("vitamin-k_100g") or 0,
                    "vitamin_b1": n.get("vitamin-b1_100g") or 0,
                    "vitamin_b2": n.get("vitamin-b2_100g") or 0,
                    "vitamin_b3": n.get("vitamin-b3_100g") or 0,
                    "vitamin_b6": n.get("vitamin-b6_100g") or 0,
                    "vitamin_b9": n.get("vitamin-b9_100g") or 0,
                    "vitamin_b12": n.get("vitamin-b12_100g") or 0,
                    # Minerals
                    "calcium": n.get("calcium_100g") or 0,
                    "iron": n.get("iron_100g") or 0,
                    "magnesium": n.get("magnesium_100g") or 0,
                    "phosphorus": n.get("phosphorus_100g") or 0,
                    "potassium": n.get("potassium_100g") or 0,
                    "sodium": n.get("sodium_100g") or 0,
                    "zinc": n.get("zinc_100g") or 0,
                    "copper": n.get("copper_100g") or 0,
                    "manganese": n.get("manganese_100g") or 0,
                    "source": "OpenFoodFacts"
                }

            # ✅ FIX: Log the actual error instead of silently swallowing it
            except requests.exceptions.HTTPError as e:
                logger.error(f"[OpenFoodFacts] HTTP error on '{subdomain}': {e} | Status: {e.response.status_code if e.response else 'N/A'}")
                continue
            except requests.exceptions.ConnectionError as e:
                logger.error(f"[OpenFoodFacts] Connection error on '{subdomain}': {e}")
                continue
            except requests.exceptions.Timeout:
                logger.error(f"[OpenFoodFacts] Request timed out on '{subdomain}'")
                continue
            except requests.exceptions.RequestException as e:
                logger.error(f"[OpenFoodFacts] Unexpected request error on '{subdomain}': {e}")
                continue
            except (ValueError, KeyError) as e:
                logger.error(f"[OpenFoodFacts] Failed to parse response on '{subdomain}': {e}")
                continue

        logger.warning(f"[OpenFoodFacts] Barcode '{barcode}' not found on any subdomain.")
        return None

    @staticmethod
    def fetch_from_nutritionix(barcode: str, app_id: str = "", app_key: str = "") -> dict | None:
        # ✅ FIX: Guard against missing credentials upfront — no need to make the request at all
        if not app_id or not app_key:
            logger.warning("[Nutritionix] Skipped: app_id or app_key not provided.")
            return None

        try:
            url = f"https://trackapi.nutritionix.com/v2/search/item?upc={barcode}"
            headers = {
                "x-app-id": app_id,
                "x-app-key": app_key,
            }
            logger.debug(f"[Nutritionix] Requesting: {url}")

            response = requests.get(url, headers=headers, timeout=10)

            # ✅ FIX: Handle 401/404 explicitly before raise_for_status
            if response.status_code == 401:
                logger.error("[Nutritionix] Unauthorized — check your app_id and app_key.")
                return None
            if response.status_code == 404:
                logger.warning(f"[Nutritionix] Barcode '{barcode}' not found.")
                return None

            response.raise_for_status()
            data = response.json()

            foods = data.get("foods", [])
            if not foods:
                logger.warning(f"[Nutritionix] No foods returned for barcode: {barcode}")
                return None

            food = foods[0]
            logger.info(f"[Nutritionix] Found: {food.get('food_name', 'Unknown')}")

            return {
                "name": food.get("food_name", ""),
                "serving": food.get("serving_unit", ""),
                # Energy
                "calories": food.get("nf_calories") or 0,
                "water": 0,
                # Fats
                "total_fat": food.get("nf_total_fat") or 0,
                "saturated_fat": food.get("nf_saturated_fat") or 0,
                "monounsaturated_fat": 0,
                "polyunsaturated_fat": 0,
                "trans_fat": 0,
                "cholesterol": food.get("nf_cholesterol") or 0,
                # Carbs
                "total_carbs": food.get("nf_total_carbohydrate") or 0,
                "fiber": food.get("nf_dietary_fiber") or 0,
                "sugars": food.get("nf_sugars") or 0,
                "starch": 0,
                # Protein
                "protein": food.get("nf_protein") or 0,
                # Vitamins
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
                # Minerals
                "calcium": food.get("nf_calcium_mg") or 0,
                "iron": food.get("nf_iron_mg") or 0,
                "magnesium": 0,
                "phosphorus": food.get("nf_p") or 0,
                "potassium": food.get("nf_potassium") or 0,
                "sodium": food.get("nf_sodium") or 0,
                "zinc": 0,
                "copper": 0,
                "manganese": 0,
                "source": "Nutritionix"
            }

        except requests.exceptions.HTTPError as e:
            logger.error(f"[Nutritionix] HTTP error: {e} | Status: {e.response.status_code if e.response else 'N/A'}")
        except requests.exceptions.ConnectionError as e:
            logger.error(f"[Nutritionix] Connection error: {e}")
        except requests.exceptions.Timeout:
            logger.error("[Nutritionix] Request timed out.")
        except requests.exceptions.RequestException as e:
            logger.error(f"[Nutritionix] Unexpected error: {e}")
        except (ValueError, KeyError) as e:
            logger.error(f"[Nutritionix] Failed to parse response: {e}")

        return None

    @staticmethod
    def fetch_from_usda(barcode: str, api_key: str = "") -> dict | None:
        # ✅ FIX: Guard against missing credentials upfront
        if not api_key:
            logger.warning("[USDA] Skipped: api_key not provided.")
            return None

        try:
            url = f"https://api.nal.usda.gov/fdc/v1/foods/search?query={barcode}&api_key={api_key}"
            logger.debug(f"[USDA] Requesting: {url}")

            response = requests.get(url, timeout=10)

            if response.status_code == 403:
                logger.error("[USDA] Forbidden — your API key may be invalid or rate-limited.")
                return None

            response.raise_for_status()
            data = response.json()

            foods = data.get("foods", [])
            if not foods:
                logger.warning(f"[USDA] No foods returned for barcode: {barcode}")
                return None

            food = foods[0]
            logger.info(f"[USDA] Found: {food.get('description', 'Unknown')}")

            n = {
                nutrient["nutrientName"]: nutrient.get("value", 0)
                for nutrient in food.get("foodNutrients", [])
            }

            return {
                "name": food.get("description", ""),
                "serving": food.get("servingSize", ""),
                # Energy
                "calories": n.get("Energy") or 0,
                "water": n.get("Water") or 0,
                # Fats
                "total_fat": n.get("Total lipid (fat)") or 0,
                "saturated_fat": n.get("Fatty acids, total saturated") or 0,
                "monounsaturated_fat": n.get("Fatty acids, total monounsaturated") or 0,
                "polyunsaturated_fat": n.get("Fatty acids, total polyunsaturated") or 0,
                "trans_fat": n.get("Fatty acids, total trans") or 0,
                "cholesterol": n.get("Cholesterol") or 0,
                # Carbs
                "total_carbs": n.get("Carbohydrate, by difference") or 0,
                "fiber": n.get("Fiber, total dietary") or 0,
                "sugars": n.get("Sugars, total including NLEA") or 0,
                "starch": n.get("Starch") or 0,
                # Protein
                "protein": n.get("Protein") or 0,
                # Vitamins
                "vitamin_a": n.get("Vitamin A, RAE") or 0,
                "vitamin_c": n.get("Vitamin C, total ascorbic acid") or 0,
                "vitamin_e": n.get("Vitamin E (alpha-tocopherol)") or 0,
                "vitamin_k": n.get("Vitamin K (phylloquinone)") or 0,
                "vitamin_b1": n.get("Thiamin") or 0,
                "vitamin_b2": n.get("Riboflavin") or 0,
                "vitamin_b3": n.get("Niacin") or 0,
                "vitamin_b6": n.get("Vitamin B-6") or 0,
                "vitamin_b9": n.get("Folate, total") or 0,
                "vitamin_b12": n.get("Vitamin B-12") or 0,
                # Minerals
                "calcium": n.get("Calcium, Ca") or 0,
                "iron": n.get("Iron, Fe") or 0,
                "magnesium": n.get("Magnesium, Mg") or 0,
                "phosphorus": n.get("Phosphorus, P") or 0,
                "potassium": n.get("Potassium, K") or 0,
                "sodium": n.get("Sodium, Na") or 0,
                "zinc": n.get("Zinc, Zn") or 0,
                "copper": n.get("Copper, Cu") or 0,
                "manganese": n.get("Manganese, Mn") or 0,
                "source": "USDA"
            }

        except requests.exceptions.HTTPError as e:
            logger.error(f"[USDA] HTTP error: {e} | Status: {e.response.status_code if e.response else 'N/A'}")
        except requests.exceptions.ConnectionError as e:
            logger.error(f"[USDA] Connection error: {e}")
        except requests.exceptions.Timeout:
            logger.error("[USDA] Request timed out.")
        except requests.exceptions.RequestException as e:
            logger.error(f"[USDA] Unexpected error: {e}")
        except (ValueError, KeyError) as e:
            logger.error(f"[USDA] Failed to parse response: {e}")

        return None

    @staticmethod
    def fetch_food(
        barcode: str,
        nutritionix_app_id: str = "",
        nutritionix_app_key: str = "",
        usda_api_key: str = "",
    ) -> dict | None:
        """
        Tries each API in order. Returns the first successful result.
        Credentials for Nutritionix and USDA are passed in explicitly —
        if empty, those fetchers are skipped cleanly instead of failing silently.
        """
        fetchers = [
            #  OpenFoodFacts is free — always try it first
            lambda: BarcodeServices.fetch_from_open_food_facts(barcode),
            #  Only attempted if credentials are provided
            lambda: BarcodeServices.fetch_from_nutritionix(barcode, nutritionix_app_id, nutritionix_app_key),
            lambda: BarcodeServices.fetch_from_usda(barcode, usda_api_key),
        ]

        for fetcher in fetchers:
            result = fetcher()
            if result:
                logger.info(f"[BarcodeServices] Found via {result['source']}")
                return result

        logger.warning(f"[BarcodeServices] Barcode '{barcode}' not found in any API.")
        return None