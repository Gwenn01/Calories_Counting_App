import requests

class BarcodeService:

    @staticmethod
    def fetch_from_open_food_facts(barcode: str) -> dict | None:
        for subdomain in ["ph", "world"]:
            try:
                url = f"https://{subdomain}.openfoodfacts.org/api/v0/product/{barcode}.json"
                response = requests.get(url, timeout=10)
                response.raise_for_status()
                data = response.json()

                if data.get("status") != 1:
                    continue

                product = data.get("product", {})
                n = product.get("nutriments", {})

                return {
                    "name": product.get("product_name", ""),
                    "serving": product.get("serving_size", ""),
                    # Energy
                    "calories": n.get("energy-kcal_100g", 0),
                    "water": n.get("water_100g", 0),
                    # Fats
                    "total_fat": n.get("fat_100g", 0),
                    "saturated_fat": n.get("saturated-fat_100g", 0),
                    "monounsaturated_fat": n.get("monounsaturated-fat_100g", 0),
                    "polyunsaturated_fat": n.get("polyunsaturated-fat_100g", 0),
                    "trans_fat": n.get("trans-fat_100g", 0),
                    "cholesterol": n.get("cholesterol_100g", 0),
                    # Carbs
                    "total_carbs": n.get("carbohydrates_100g", 0),
                    "fiber": n.get("fiber_100g", 0),
                    "sugars": n.get("sugars_100g", 0),
                    "starch": n.get("starch_100g", 0),
                    # Protein
                    "protein": n.get("proteins_100g", 0),
                    # Vitamins
                    "vitamin_a": n.get("vitamin-a_100g", 0),
                    "vitamin_c": n.get("vitamin-c_100g", 0),
                    "vitamin_e": n.get("vitamin-e_100g", 0),
                    "vitamin_k": n.get("vitamin-k_100g", 0),
                    "vitamin_b1": n.get("vitamin-b1_100g", 0),
                    "vitamin_b2": n.get("vitamin-b2_100g", 0),
                    "vitamin_b3": n.get("vitamin-b3_100g", 0),
                    "vitamin_b6": n.get("vitamin-b6_100g", 0),
                    "vitamin_b9": n.get("vitamin-b9_100g", 0),
                    "vitamin_b12": n.get("vitamin-b12_100g", 0),
                    # Minerals
                    "calcium": n.get("calcium_100g", 0),
                    "iron": n.get("iron_100g", 0),
                    "magnesium": n.get("magnesium_100g", 0),
                    "phosphorus": n.get("phosphorus_100g", 0),
                    "potassium": n.get("potassium_100g", 0),
                    "sodium": n.get("sodium_100g", 0),
                    "zinc": n.get("zinc_100g", 0),
                    "copper": n.get("copper_100g", 0),
                    "manganese": n.get("manganese_100g", 0),
                    "source": "OpenFoodFacts"
                }
            except requests.exceptions.RequestException:
                continue
        return None

    @staticmethod
    def fetch_from_nutritionix(barcode: str) -> dict | None:
        try:
            url = f"https://trackapi.nutritionix.com/v2/search/item?upc={barcode}"
            headers = {
                "x-app-id": "YOUR_APP_ID",
                "x-app-key": "YOUR_APP_KEY",
            }
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            data = response.json()

            food = data.get("foods", [{}])[0]
            if not food:
                return None

            return {
                "name": food.get("food_name", ""),
                "serving": food.get("serving_unit", ""),
                # Energy
                "calories": food.get("nf_calories", 0),
                "water": 0,  # not provided
                # Fats
                "total_fat": food.get("nf_total_fat", 0),
                "saturated_fat": food.get("nf_saturated_fat", 0),
                "monounsaturated_fat": 0,  # not provided
                "polyunsaturated_fat": 0,  # not provided
                "trans_fat": 0,            # not provided
                "cholesterol": food.get("nf_cholesterol", 0),
                # Carbs
                "total_carbs": food.get("nf_total_carbohydrate", 0),
                "fiber": food.get("nf_dietary_fiber", 0),
                "sugars": food.get("nf_sugars", 0),
                "starch": 0,  # not provided
                # Protein
                "protein": food.get("nf_protein", 0),
                # Vitamins (Nutritionix doesn't provide most vitamins)
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
                "calcium": food.get("nf_calcium_mg", 0),
                "iron": food.get("nf_iron_mg", 0),
                "magnesium": 0,  # not provided
                "phosphorus": food.get("nf_p", 0),
                "potassium": food.get("nf_potassium", 0),
                "sodium": food.get("nf_sodium", 0),
                "zinc": 0,      # not provided
                "copper": 0,    # not provided
                "manganese": 0, # not provided
                "source": "Nutritionix"
            }
        except requests.exceptions.RequestException:
            return None

    @staticmethod
    def fetch_from_usda(barcode: str) -> dict | None:
        try:
            url = f"https://api.nal.usda.gov/fdc/v1/foods/search?query={barcode}&api_key=YOUR_KEY"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()

            food = data.get("foods", [{}])[0]
            if not food:
                return None

            # Map USDA nutrient names to values
            n = {nutrient["nutrientName"]: nutrient.get("value", 0) for nutrient in food.get("foodNutrients", [])}

            return {
                "name": food.get("description", ""),
                "serving": food.get("servingSize", ""),
                # Energy
                "calories": n.get("Energy", 0),
                "water": n.get("Water", 0),
                # Fats
                "total_fat": n.get("Total lipid (fat)", 0),
                "saturated_fat": n.get("Fatty acids, total saturated", 0),
                "monounsaturated_fat": n.get("Fatty acids, total monounsaturated", 0),
                "polyunsaturated_fat": n.get("Fatty acids, total polyunsaturated", 0),
                "trans_fat": n.get("Fatty acids, total trans", 0),
                "cholesterol": n.get("Cholesterol", 0),
                # Carbs
                "total_carbs": n.get("Carbohydrate, by difference", 0),
                "fiber": n.get("Fiber, total dietary", 0),
                "sugars": n.get("Sugars, total including NLEA", 0),
                "starch": n.get("Starch", 0),
                # Protein
                "protein": n.get("Protein", 0),
                # Vitamins
                "vitamin_a": n.get("Vitamin A, RAE", 0),
                "vitamin_c": n.get("Vitamin C, total ascorbic acid", 0),
                "vitamin_e": n.get("Vitamin E (alpha-tocopherol)", 0),
                "vitamin_k": n.get("Vitamin K (phylloquinone)", 0),
                "vitamin_b1": n.get("Thiamin", 0),
                "vitamin_b2": n.get("Riboflavin", 0),
                "vitamin_b3": n.get("Niacin", 0),
                "vitamin_b6": n.get("Vitamin B-6", 0),
                "vitamin_b9": n.get("Folate, total", 0),
                "vitamin_b12": n.get("Vitamin B-12", 0),
                # Minerals
                "calcium": n.get("Calcium, Ca", 0),
                "iron": n.get("Iron, Fe", 0),
                "magnesium": n.get("Magnesium, Mg", 0),
                "phosphorus": n.get("Phosphorus, P", 0),
                "potassium": n.get("Potassium, K", 0),
                "sodium": n.get("Sodium, Na", 0),
                "zinc": n.get("Zinc, Zn", 0),
                "copper": n.get("Copper, Cu", 0),
                "manganese": n.get("Manganese, Mn", 0),
                "source": "USDA"
            }
        except requests.exceptions.RequestException:
            return None

    @staticmethod
    def fetch_food(barcode: str) -> dict | None:
        fetchers = [
            BarcodeService.fetch_from_open_food_facts,
            BarcodeService.fetch_from_nutritionix,
            BarcodeService.fetch_from_usda,
        ]

        for fetcher in fetchers:
            result = fetcher(barcode)
            if result:
                print(f" Found via {result['source']}")
                return result

        print(" Not found in any API")
        return None