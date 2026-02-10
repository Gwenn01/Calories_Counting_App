# users/services.py
from django.shortcuts import get_object_or_404
from .models import UserProfile
from macros.services import MacrosService

class UserProfileService:
    
    @staticmethod
    def get_user_profile(user):
        return get_object_or_404(UserProfile, user=user)

    @staticmethod
    def calculate_remaining_macros(user):
        profile = UserProfileService.get_user_profile(user)
        daily_macros = MacrosService.get_today_macros(user)

        calories = daily_macros.calories if daily_macros else 0
        protein = daily_macros.protein if daily_macros else 0
        carbs = daily_macros.carbs if daily_macros else 0
        fats = daily_macros.fats if daily_macros else 0

        return {
            "calories_goal": profile.target_calories,
            "current_calories": calories,
            "calories_remaining": profile.target_calories - calories,

            "protein_goal": profile.target_protein,
            "current_protein": protein,
            "protein_remaining": profile.target_protein - protein,

            "carbs_goal": profile.target_carbs,
            "current_carbs": carbs,
            "carbs_remaining": profile.target_carbs - carbs,

            "fats_goal": profile.target_fats,
            "current_fats": fats,
            "fats_remaining": profile.target_fats - fats,
        }

        