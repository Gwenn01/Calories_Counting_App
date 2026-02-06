from django.db.models import Sum
from .models import DailyLog

class FoodLogService:

    @staticmethod
    def get_daily_logs(user, date):
        return FoodLog.objects.filter(
            user=user,
            created_at=date
        )

    @staticmethod
    def get_daily_macros(user, date):
        logs = FoodLogService.get_daily_logs(user, date)

        return logs.aggregate(
            total_calories=Sum("total_calories"),
            total_protein=Sum("protein"),
            total_carbs=Sum("carbs"),
            total_fat=Sum("fat")
        )
