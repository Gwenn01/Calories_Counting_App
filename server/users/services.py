# users/services.py
from django.shortcuts import get_object_or_404
from django.db.models import Sum, Avg, Count
from collections import defaultdict
from django.utils import timezone
from datetime import timedelta
from .models import UserProfile
from macros.services import MacrosService
from workout.models import WorkoutSession, WorkoutExercise, Set
from macros.models import Macros

class UserProfileService:
    #get the user profile
    @staticmethod
    def get_user_profile(user):
        return get_object_or_404(UserProfile, user=user)
    
    # login services =============================================
    # generate macros base on calories
    @staticmethod
    def generate_macros_base_calories(total_calories):
        macros_percent = {
            "protein": 0.30,
            "carbs": 0.40,
            "fat": 0.30
        }

        protein_grams = (total_calories * macros_percent["protein"]) / 4
        carbs_grams = (total_calories * macros_percent["carbs"]) / 4
        fat_grams = (total_calories * macros_percent["fat"]) / 9

        return {
            "protein_g": round(protein_grams),
            "carbs_g": round(carbs_grams),
            "fat_g": round(fat_grams)
        }
    
    # calculate the calories
    @staticmethod
    def calculate_bmr(weight, height, age, gender):
        if gender == "male":
            return 10 * weight + 6.25 * height - 5 * age + 5
        else:  # female
            return 10 * weight + 6.25 * height - 5 * age - 161
            
    @staticmethod
    def calculate_daily_calories(age, weight, height, gender, activity_level, goal):
        ACTIVITY_MULTIPLIER = {
            "sedentary": 1.2,
            "light": 1.375,
            "moderate": 1.55,
            "active": 1.725,
            "athlete": 1.9,
        }
        bmr = UserProfileService.calculate_bmr(weight, height, age, gender)
        activity_multiplier = ACTIVITY_MULTIPLIER[activity_level]

        if goal == "loss":
            daily_calories = bmr * activity_multiplier * 0.8
        elif goal == "gain":
            daily_calories = bmr * activity_multiplier * 1.2
        else:
            daily_calories = bmr * activity_multiplier

        return daily_calories
    
    # ==============================================
    #  Overview summary services 
    # ==============================================
    #calculate the daily remaining macros =============================
    @staticmethod
    def calculate_remaining_macros(user):
        profile = UserProfileService.get_user_profile(user)
        daily_macros = MacrosService.get_today_macros(user)

        calories = daily_macros.calories if daily_macros else 0
        protein = daily_macros.protein if daily_macros else 0
        carbs = daily_macros.carbs if daily_macros else 0
        fats = daily_macros.fats if daily_macros else 0

        return {
            "calories_goal": int(profile.target_calories),
            "current_calories": int(calories),
            "calories_remaining": int(profile.target_calories - calories),

            "protein_goal": int(profile.target_protein),
            "current_protein": int(protein),
            "protein_remaining": int(profile.target_protein - protein),

            "carbs_goal": int(profile.target_carbs),
            "current_carbs": int(carbs),
            "carbs_remaining": int(profile.target_carbs - carbs),

            "fats_goal": int(profile.target_fats),
            "current_fats": int(fats),
            "fats_remaining": int(profile.target_fats - fats),
        }
    
    # calculate the workout overview =============================
    @staticmethod
    def calculate_calories(sessions, duration_seconds):
        """
        Rough estimation using MET formula.

        Calories = MET × weight(kg) × duration(hours)

        Weight training:
        - light = 3.5
        - moderate = 5
        - intense = 6-8
        """

        if not sessions.exists():
            return 0

        session = sessions.first()

        bodyweight = session.bodyweight or 70

        duration_hours = duration_seconds / 3600

        # moderate lifting
        MET = 5.5

        calories = MET * bodyweight * duration_hours

        return calories


    @staticmethod
    def calculate_workout_overview(user):
        today = timezone.localdate()
    
        sessions = WorkoutSession.objects.filter(
            user=user,
            date=today,
            is_finished=True
        )

        sets = Set.objects.filter(
            workout_exercise__session__in=sessions,
            completed=True
        )

        # -----------------------------
        # BASIC TOTALS
        # -----------------------------
        total_workouts = sessions.count()

        total_duration = (
            sessions.aggregate(
                total=Sum("duration_seconds")
            )["total"] or 0
        )

        total_sets = sets.count()

        total_reps = (
            sets.aggregate(
                total=Sum("reps")
            )["total"] or 0
        )

        # volume = weight × reps
        total_volume = sum(
            s.weight * s.reps
            for s in sets
        )

        # -----------------------------
        # CALORIES BURNED ESTIMATION
        # -----------------------------
        calories_burned = UserProfileService.calculate_calories(
            sessions,
            total_duration
        )

        # -----------------------------
        # MOOD / ENERGY
        # -----------------------------
        avg_energy = (
            sessions.aggregate(
                avg=Avg("energy_level")
            )["avg"] or 0
        )

        avg_mood = (
            sessions.aggregate(
                avg=Avg("mood_rating")
            )["avg"] or 0
        )

        # -----------------------------
        # PR COUNT
        # -----------------------------
        pr_count = sets.filter(is_pr=True).count()

        return {
            "date": today,
            "total_workouts": total_workouts,
            "total_duration_seconds": total_duration,
            "total_duration_minutes": round(total_duration / 60, 1),
            "total_sets": total_sets,
            "total_reps": total_reps,
            "total_volume": round(total_volume, 2),
            "calories_burned": round(calories_burned, 2),
            "average_energy": round(avg_energy, 1),
            "average_mood": round(avg_mood, 1),
            "pr_count": pr_count,
        }
        
    # calculate the calendar overview workout ===========================
    def overview_calendar(user, year, month):
        # -----------------------------
        # WORKOUT SESSIONS
        # -----------------------------
        sessions = WorkoutSession.objects.filter(
            user=user,
            date__year=year,
            date__month=month,
            is_finished=True
        ).values(
            "date",
            "category",
            "duration_seconds",
        )

        # -----------------------------
        # MACROS
        # -----------------------------
        macros = Macros.objects.filter(
            user=user.profile,
            date__year=year,
            date__month=month
        ).values("date", "calories", "protein", "carbs", "fats")

        # -----------------------------
        # COMBINED RESULT
        # -----------------------------
        result = defaultdict(lambda: {
            "date": None,
            "categories": [],
            "total_workouts": 0,       # now = total exercises done
            "total_duration_seconds": 0,
            "total_duration_minutes": 0.0,
            "calories_burned": 0.0,
            "calories": 0,
            "protein": 0,
            "carbs": 0,
            "fats": 0,
        })

        # ── Categories and duration per date ─────────────────────────────────────
        for session in sessions:
            date_str = str(session["date"])
            result[date_str]["date"] = date_str
            result[date_str]["total_duration_seconds"] += session["duration_seconds"] or 0

            if session["category"] not in result[date_str]["categories"]:
                result[date_str]["categories"].append(session["category"])

        # ── Total exercises + duration + calories per date ────────────────────────
        session_aggregates = WorkoutSession.objects.filter(
            user=user,
            date__year=year,
            date__month=month,
            is_finished=True,
        ).values("date").annotate(
            total_duration=Sum("duration_seconds"),
            # Count distinct exercises across all sessions on that date
            total_exercises=Count("workout_exercises__exercise", distinct=True),
        )

        for agg in session_aggregates:
            date_str = str(agg["date"])
            duration_seconds = agg["total_duration"] or 0

            result[date_str]["total_duration_seconds"] = duration_seconds
            result[date_str]["total_duration_minutes"] = round(duration_seconds / 60, 1)
            result[date_str]["total_workouts"] = agg["total_exercises"]  # ← exercises now

            day_sessions = WorkoutSession.objects.filter(
                user=user,
                date=agg["date"],
                is_finished=True,
            )
            result[date_str]["calories_burned"] = round(
                UserProfileService.calculate_calories(day_sessions, duration_seconds), 2
            )

        # ── Macros data ───────────────────────────────────────────────────────────
        for macro in macros:
            date_str = str(macro["date"])
            result[date_str]["date"] = date_str
            result[date_str]["calories"] = macro["calories"]
            result[date_str]["protein"] = macro["protein"]
            result[date_str]["carbs"] = macro["carbs"]
            result[date_str]["fats"] = macro["fats"]

        return list(result.values())