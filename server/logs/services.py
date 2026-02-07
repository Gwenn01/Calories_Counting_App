from django.db.models import Sum, F, Value
from django.db.models.functions import Coalesce
from django.utils import timezone
from .models import DailyLog

class FoodLogService:
    
    @staticmethod
    def normalize_macros(raw_macros):
        """
        Ensure only valid Macros fields are returned
        and no None values slip through
        """
        raw_macros['trans_fat'] = 0
        allowed_fields = {
            "calories", "protein", "carbs", "fats", "fiber", "sugar",
            "saturated_fat", "monounsaturated_fat", "polyunsaturated_fat", "trans_fat",
            "cholesterol", "sodium",
            "vitamin_a", "vitamin_c", "vitamin_d", "vitamin_e", "vitamin_k",
            "vitamin_b1", "vitamin_b2", "vitamin_b3", "vitamin_b6",
            "vitamin_b9", "vitamin_b12",
            "calcium", "iron", "magnesium", "phosphorus",
            "potassium", "zinc", "copper", "manganese",
        }

        return {
            key: float(raw_macros.get(key) or 0)
            for key in allowed_fields
        }
    
    @staticmethod
    def get_daily_logs(user):
        today = timezone.now().date()
        return DailyLog.objects.filter(
            user=user,
            created_at=today
        ).select_related("food")
    # calculate the food nutrition base on the data log of user
    @staticmethod
    def get_daily_macros(user):
        logs = FoodLogService.get_daily_logs(user)

        raw_macros = logs.aggregate(
        # Core
            calories=Coalesce(Sum(F("food__calories") * F("quantity")), 0),
            protein=Coalesce(Sum(F("food__protein") * F("quantity")), 0),
            carbs=Coalesce(Sum(F("food__total_carbs") * F("quantity")), 0),
            fats=Coalesce(Sum(F("food__total_fat") * F("quantity")), 0),
            fiber=Coalesce(Sum(F("food__fiber") * F("quantity")), 0),
            sugar=Coalesce(Sum(F("food__sugars") * F("quantity")), 0),

            # Fats breakdown
            saturated_fat=Coalesce(Sum(F("food__saturated_fat") * F("quantity")), 0),
            monounsaturated_fat=Coalesce(Sum(F("food__monounsaturated_fat") * F("quantity")), 0),
            polyunsaturated_fat=Coalesce(Sum(F("food__polyunsaturated_fat") * F("quantity")), 0),

            # Cholesterol & sodium
            cholesterol=Coalesce(Sum(F("food__cholesterol") * F("quantity")), 0),
            sodium=Coalesce(Sum(F("food__sodium") * F("quantity")), 0),

            # Vitamins
            vitamin_a=Coalesce(Sum(F("food__vitamin_a") * F("quantity")), 0),
            vitamin_c=Coalesce(Sum(F("food__vitamin_c") * F("quantity")), 0),
            vitamin_e=Coalesce(Sum(F("food__vitamin_e") * F("quantity")), 0),
            vitamin_k=Coalesce(Sum(F("food__vitamin_k") * F("quantity")), 0),
            vitamin_b1=Coalesce(Sum(F("food__thiamin_b1") * F("quantity")), 0),
            vitamin_b2=Coalesce(Sum(F("food__riboflavin_b2") * F("quantity")), 0),
            vitamin_b3=Coalesce(Sum(F("food__niacin_b3") * F("quantity")), 0),
            vitamin_b6=Coalesce(Sum(F("food__vitamin_b6") * F("quantity")), 0),
            vitamin_b9=Coalesce(Sum(F("food__folate_b9") * F("quantity")), 0),

            # Minerals
            calcium=Coalesce(Sum(F("food__calcium") * F("quantity")), 0),
            iron=Coalesce(Sum(F("food__iron") * F("quantity")), 0),
            magnesium=Coalesce(Sum(F("food__magnesium") * F("quantity")), 0),
            phosphorus=Coalesce(Sum(F("food__phosphorus") * F("quantity")), 0),
            potassium=Coalesce(Sum(F("food__potassium") * F("quantity")), 0),
            zinc=Coalesce(Sum(F("food__zinc") * F("quantity")), 0),
            copper=Coalesce(Sum(F("food__copper") * F("quantity")), 0),
            manganese=Coalesce(Sum(F("food__manganese") * F("quantity")), 0),
        )
        
        
        return  FoodLogService.normalize_macros(raw_macros)
