from django.contrib import admin
from .models import (
    Exercise,
    UserFitnessProfile,
    WorkoutTemplate,
    TemplateExercise,
    WorkoutSession,
    WorkoutExercise,
    Set,
    PersonalRecord,
    WorkoutHistorySnapshot,
    ProgressionSuggestion,
)


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ("name", "muscle_group", "equipment", "exercise_type", "difficulty", "is_global")
    list_filter = ("muscle_group", "equipment", "exercise_type", "difficulty", "is_global")
    search_fields = ("name",)
    ordering = ("name",)


@admin.register(UserFitnessProfile)
class UserFitnessProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "weight_unit", "experience_level", "progression_type", "default_rest_time")
    list_filter = ("weight_unit", "experience_level", "progression_type")
    search_fields = ("user__username",)


@admin.register(WorkoutTemplate)
class WorkoutTemplateAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "category", "estimated_duration", "is_public", "created_at")
    list_filter = ("category", "is_public")
    search_fields = ("name", "user__username")
    ordering = ("-created_at",)


@admin.register(TemplateExercise)
class TemplateExerciseAdmin(admin.ModelAdmin):
    list_display = ("exercise", "template", "order", "default_sets", "default_reps", "default_weight", "default_rest")
    list_filter = ("template__category",)
    search_fields = ("exercise__name", "template__name")
    ordering = ("template", "order")


@admin.register(WorkoutSession)
class WorkoutSessionAdmin(admin.ModelAdmin):
    list_display = ("user", "category", "date", "start_time", "end_time", "duration_seconds", "is_finished")
    list_filter = ("category", "is_finished", "date")
    search_fields = ("user__username",)
    ordering = ("-date", "-start_time")


@admin.register(WorkoutExercise)
class WorkoutExerciseAdmin(admin.ModelAdmin):
    list_display = ("exercise", "session", "order", "is_favorite", "superset_group")
    list_filter = ("is_favorite",)
    search_fields = ("exercise__name", "session__user__username")
    ordering = ("session", "order")


@admin.register(Set)
class SetAdmin(admin.ModelAdmin):
    list_display = ("workout_exercise", "set_number", "weight", "reps", "completed", "is_warmup", "is_pr", "rest_target")
    list_filter = ("completed", "is_warmup", "is_dropset", "is_pr")
    search_fields = ("workout_exercise__exercise__name",)
    ordering = ("workout_exercise", "set_number")


@admin.register(PersonalRecord)
class PersonalRecordAdmin(admin.ModelAdmin):
    list_display = ("user", "exercise", "max_weight", "max_reps", "max_volume", "max_1rm", "updated_at")
    list_filter = ("exercise__muscle_group",)
    search_fields = ("user__username", "exercise__name")
    ordering = ("-updated_at",)


@admin.register(WorkoutHistorySnapshot)
class WorkoutHistorySnapshotAdmin(admin.ModelAdmin):
    list_display = ("user", "date", "category", "total_volume", "total_sets", "total_reps", "duration_secs", "prs_broken")
    list_filter = ("category", "date")
    search_fields = ("user__username",)
    ordering = ("-date",)


@admin.register(ProgressionSuggestion)
class ProgressionSuggestionAdmin(admin.ModelAdmin):
    list_display = ("user", "exercise", "suggested_weight", "suggested_reps", "suggested_sets", "progression_type", "applied", "generated_at")
    list_filter = ("progression_type", "applied")
    search_fields = ("user__username", "exercise__name")
    ordering = ("-generated_at",)