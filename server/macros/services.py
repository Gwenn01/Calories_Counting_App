from django.utils import timezone
from django.contrib.auth.models import User
from users.models import UserProfile
from .models import Macros
from logs.services import FoodLogService


class MacrosService:
    
    @staticmethod
    def upsert_today_macros(user):
        """
        Recompute and insert/update today's macros for a user
        """
        today = timezone.now().date()
        user_profile = UserProfile.objects.get(user=user)
        macros_data = FoodLogService.get_daily_macros(user)
        print(macros_data)
        macros, created = Macros.objects.update_or_create(
            user=user_profile,
            date=today,
            defaults=macros_data
        )

        return macros
    
    @staticmethod
    def get_today_macros(user):
        today = timezone.now().date()
        user_profile = UserProfile.objects.get(user=user)

        return Macros.objects.filter(
            user=user_profile,
            date=today
        ).first()
