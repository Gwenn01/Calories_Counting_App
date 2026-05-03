from rest_framework import serializers
from .models import (
    Exercise,
    WorkoutSession,
    WorkoutExercise,
    Set,
    PersonalRecord,
    WorkoutTemplate,
    TemplateExercise,
    WorkoutHistorySnapshot,
    ProgressionSuggestion,
    UserFitnessProfile,
)


# ─────────────────────────────────────────────────────────────────
# EXERCISE
# ─────────────────────────────────────────────────────────────────

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Exercise
        fields = [
            "id", "name", "muscle_group", "secondary_muscles",
            "equipment", "exercise_type", "difficulty",
            "instructions", "tips", "image_url", "video_url",
            "is_global", "created_by",
        ]
        read_only_fields = ["id", "created_by"]


# ─────────────────────────────────────────────────────────────────
# USER FITNESS PROFILE
# ─────────────────────────────────────────────────────────────────

class UserFitnessProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = UserFitnessProfile
        fields = [
            "id", "weight_unit", "default_rest_time",
            "experience_level", "progression_type",
            "progression_increment_kg", "progression_increment_lbs",
            "updated_at",
        ]
        read_only_fields = ["id", "updated_at"]


# ─────────────────────────────────────────────────────────────────
# SET
# ─────────────────────────────────────────────────────────────────

class SetSerializer(serializers.ModelSerializer):
    volume        = serializers.FloatField(read_only=True)
    estimated_1rm = serializers.FloatField(read_only=True)

    class Meta:
        model  = Set
        fields = [
            "id", "set_number", "weight", "reps", "completed",
            "rpe", "rest_taken", "rest_target", "tempo",
            "is_warmup", "is_dropset", "is_pr",
            "volume", "estimated_1rm", "completed_at",
        ]
        read_only_fields = ["id", "volume", "estimated_1rm", "completed_at", "is_pr"]


class SetCreateSerializer(serializers.ModelSerializer):
    """Lightweight serializer for creating/updating a set."""
    class Meta:
        model  = Set
        fields = [
            "id", "set_number", "weight", "reps",
            "rpe", "rest_taken", "rest_target",
            "is_warmup", "is_dropset",
        ]
        read_only_fields = ["id"]


# ─────────────────────────────────────────────────────────────────
# WORKOUT EXERCISE
# ─────────────────────────────────────────────────────────────────

class WorkoutExerciseSerializer(serializers.ModelSerializer):
    exercise     = ExerciseSerializer(read_only=True)
    exercise_id  = serializers.PrimaryKeyRelatedField(
        queryset=Exercise.objects.all(), source="exercise", write_only=True
    )
    sets         = SetSerializer(many=True, read_only=True)
    total_volume = serializers.FloatField(read_only=True)
    best_set     = serializers.SerializerMethodField()

    class Meta:
        model  = WorkoutExercise
        fields = [
            "id", "exercise", "exercise_id", "order",
            "notes", "is_favorite", "superset_group",
            "sets", "total_volume", "best_set",
        ]
        read_only_fields = ["id", "total_volume", "best_set"]

    def get_best_set(self, obj):
        best = obj.best_set
        if best is None:
            return None
        return {"weight": best.weight, "reps": best.reps, "volume": best.volume}


# ─────────────────────────────────────────────────────────────────
# WORKOUT SESSION
# ─────────────────────────────────────────────────────────────────

class WorkoutSessionListSerializer(serializers.ModelSerializer):
    """Compact serializer for session list / history cards."""
    total_volume         = serializers.FloatField(read_only=True)
    total_sets_completed = serializers.IntegerField(read_only=True)
    total_reps           = serializers.IntegerField(read_only=True)
    exercise_count       = serializers.SerializerMethodField()

    class Meta:
        model  = WorkoutSession
        fields = [
            "id", "date", "category", "duration_seconds",
            "total_volume", "total_sets_completed", "total_reps",
            "exercise_count", "energy_level", "mood_rating", "is_finished",
        ]

    def get_exercise_count(self, obj):
        return obj.workout_exercises.count()


class WorkoutSessionDetailSerializer(serializers.ModelSerializer):
    """Full serializer — used for active session and summary screen."""
    workout_exercises    = WorkoutExerciseSerializer(many=True, read_only=True)
    total_volume         = serializers.FloatField(read_only=True)
    total_sets_completed = serializers.IntegerField(read_only=True)
    total_reps           = serializers.IntegerField(read_only=True)

    class Meta:
        model  = WorkoutSession
        fields = [
            "id", "date", "category", "template",
            "start_time", "end_time", "duration_seconds",
            "notes", "energy_level", "mood_rating",
            "bodyweight", "weight_unit",
            "total_volume", "total_sets_completed", "total_reps",
            "workout_exercises", "is_finished",
        ]
        read_only_fields = [
            "id", "start_time", "end_time", "duration_seconds",
            "total_volume", "total_sets_completed", "total_reps",
        ]


class WorkoutSessionCreateSerializer(serializers.ModelSerializer):
    """Used to start a new session (POST /sessions/)."""
    class Meta:
        model  = WorkoutSession
        fields = ["id", "date", "category", "template", "bodyweight", "weight_unit", "notes"]
        read_only_fields = ["id"]


# ─────────────────────────────────────────────────────────────────
# TEMPLATE
# ─────────────────────────────────────────────────────────────────

class TemplateExerciseSerializer(serializers.ModelSerializer):
    exercise    = ExerciseSerializer(read_only=True)
    exercise_id = serializers.PrimaryKeyRelatedField(
        queryset=Exercise.objects.all(), source="exercise", write_only=True
    )

    class Meta:
        model  = TemplateExercise
        fields = [
            "id", "exercise", "exercise_id", "order",
            "default_sets", "default_reps", "default_weight",
            "default_rest", "superset_group", "notes",
        ]
        read_only_fields = ["id"]


class WorkoutTemplateSerializer(serializers.ModelSerializer):
    template_exercises = TemplateExerciseSerializer(many=True, read_only=True)

    class Meta:
        model  = WorkoutTemplate
        fields = [
            "id", "name", "category", "description",
            "is_public", "estimated_duration",
            "template_exercises", "created_at",
        ]
        read_only_fields = ["id", "created_at"]


# ─────────────────────────────────────────────────────────────────
# PERSONAL RECORDS
# ─────────────────────────────────────────────────────────────────

class PersonalRecordSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer(read_only=True)

    class Meta:
        model  = PersonalRecord
        fields = [
            "id", "exercise",
            "max_weight", "max_reps", "max_volume", "max_1rm",
            "achieved_at", "updated_at",
        ]
        read_only_fields = fields


# ─────────────────────────────────────────────────────────────────
# HISTORY SNAPSHOT
# ─────────────────────────────────────────────────────────────────

class WorkoutHistorySnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model  = WorkoutHistorySnapshot
        fields = [
            "id", "date", "category",
            "total_volume", "total_sets", "total_reps",
            "duration_secs", "prs_broken",
        ]
        read_only_fields = fields


# ─────────────────────────────────────────────────────────────────
# PROGRESSION SUGGESTION
# ─────────────────────────────────────────────────────────────────

class ProgressionSuggestionSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer(read_only=True)

    class Meta:
        model  = ProgressionSuggestion
        fields = [
            "id", "exercise",
            "last_weight", "last_reps", "last_rpe",
            "suggested_weight", "suggested_reps", "suggested_sets",
            "reason", "progression_type",
            "generated_at", "applied",
        ]
        read_only_fields = fields