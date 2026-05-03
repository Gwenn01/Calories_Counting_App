from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone


# ─────────────────────────────────────────────────────────────────
# CHOICES
# ─────────────────────────────────────────────────────────────────

class MuscleGroup(models.TextChoices):
    CHEST      = "chest",      "Chest"
    BACK       = "back",       "Back"
    SHOULDERS  = "shoulders",  "Shoulders"
    BICEPS     = "biceps",     "Biceps"
    TRICEPS    = "triceps",    "Triceps"
    FOREARMS   = "forearms",   "Forearms"
    CORE       = "core",       "Core"
    QUADS      = "quads",      "Quads"
    HAMSTRINGS = "hamstrings", "Hamstrings"
    GLUTES     = "glutes",     "Glutes"
    CALVES     = "calves",     "Calves"
    FULL_BODY  = "full_body",  "Full Body"
    CARDIO     = "cardio",     "Cardio"


class WorkoutCategory(models.TextChoices):
    PUSH      = "push",      "Push"
    PULL      = "pull",      "Pull"
    LEGS      = "legs",      "Legs"
    FULL_BODY = "full_body", "Full Body"
    ANTERIOR  = "anterior", "Anterior"
    POSTERIOR = "posterior", "Posterior"
    "UPPER"   = "upper", "Upper"
    "LOWER"   = "lower", "Lower"
    CARDIO    = "cardio",    "Cardio"
    CUSTOM    = "custom",    "Custom"


class EquipmentType(models.TextChoices):
    BARBELL    = "barbell",    "Barbell"
    DUMBBELL   = "dumbbell",   "Dumbbell"
    CABLE      = "cable",      "Cable"
    MACHINE    = "machine",    "Machine"
    BODYWEIGHT = "bodyweight", "Bodyweight"
    KETTLEBELL = "kettlebell", "Kettlebell"
    BAND       = "band",       "Resistance Band"
    OTHER      = "other",      "Other"


class ExerciseType(models.TextChoices):
    STRENGTH  = "strength",  "Strength"
    CARDIO    = "cardio",    "Cardio"
    STRETCHING = "stretching", "Stretching"
    PLYOMETRIC = "plyometric", "Plyometric"


class DifficultyLevel(models.TextChoices):
    BEGINNER     = "beginner",     "Beginner"
    INTERMEDIATE = "intermediate", "Intermediate"
    ADVANCED     = "advanced",     "Advanced"


class WeightUnit(models.TextChoices):
    KG  = "kg",  "Kilograms"
    LBS = "lbs", "Pounds"


class ProgressionType(models.TextChoices):
    LINEAR      = "linear",      "Linear (add weight each session)"
    DOUBLE      = "double",      "Double Progression (reps then weight)"
    PERCENTAGE  = "percentage",  "Percentage-based"
    RPE         = "rpe",         "RPE-based"


# ─────────────────────────────────────────────────────────────────
# EXERCISE LIBRARY
# ─────────────────────────────────────────────────────────────────

class Exercise(models.Model):
    """
    Global exercise library — shared across all users.
    Admins seed this; users can also create custom exercises.
    """
    name            = models.CharField(max_length=100, unique=True)
    muscle_group    = models.CharField(max_length=50, choices=MuscleGroup.choices)
    secondary_muscles = models.JSONField(default=list, blank=True)
    # e.g. ["triceps", "shoulders"] for bench press

    equipment       = models.CharField(
        max_length=50,
        choices=EquipmentType.choices,
        default=EquipmentType.BARBELL,
    )
    exercise_type   = models.CharField(
        max_length=50,
        choices=ExerciseType.choices,
        default=ExerciseType.STRENGTH,
    )
    difficulty      = models.CharField(
        max_length=50,
        choices=DifficultyLevel.choices,
        default=DifficultyLevel.INTERMEDIATE,
    )

    # Instructions and media
    instructions    = models.TextField(blank=True)
    tips            = models.TextField(blank=True)
    image_url       = models.URLField(blank=True)
    video_url       = models.URLField(blank=True)

    # Whether this is a system exercise or user-created
    is_global       = models.BooleanField(default=True)
    created_by      = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="custom_exercises",
    )

    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.muscle_group})"


# ─────────────────────────────────────────────────────────────────
# USER FITNESS PROFILE
# ─────────────────────────────────────────────────────────────────

class UserFitnessProfile(models.Model):
    """
    Stores user-level fitness settings used for auto-progression
    suggestions, RPE calibration, and 1RM estimation.
    """
    user             = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="fitness_profile"
    )
    weight_unit      = models.CharField(
        max_length=5,
        choices=WeightUnit.choices,
        default=WeightUnit.KG,
    )
    default_rest_time = models.IntegerField(default=90)  # seconds
    experience_level  = models.CharField(
        max_length=50,
        choices=DifficultyLevel.choices,
        default=DifficultyLevel.BEGINNER,
    )
    progression_type  = models.CharField(
        max_length=50,
        choices=ProgressionType.choices,
        default=ProgressionType.DOUBLE,
    )
    # For percentage-based progression
    progression_increment_kg  = models.FloatField(default=2.5)
    progression_increment_lbs = models.FloatField(default=5.0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - Fitness Profile"


# ─────────────────────────────────────────────────────────────────
# WORKOUT TEMPLATE
# ─────────────────────────────────────────────────────────────────

class WorkoutTemplate(models.Model):
    """
    Reusable workout plan a user can launch quickly.
    """
    user         = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="workout_templates"
    )
    name         = models.CharField(max_length=100)  # e.g. "Push Day A"
    category     = models.CharField(
        max_length=50, choices=WorkoutCategory.choices, default=WorkoutCategory.PUSH
    )
    description  = models.TextField(blank=True)
    is_public    = models.BooleanField(default=False)  # share with community

    # Estimated duration in minutes
    estimated_duration = models.IntegerField(null=True, blank=True)

    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.user.username})"


class TemplateExercise(models.Model):
    """
    An exercise slot inside a WorkoutTemplate.
    """
    template      = models.ForeignKey(
        WorkoutTemplate,
        on_delete=models.CASCADE,
        related_name="template_exercises",
    )
    exercise      = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    order         = models.PositiveIntegerField(default=0)

    # Defaults pre-filled when session starts
    default_sets    = models.IntegerField(default=3)
    default_reps    = models.IntegerField(default=10)
    default_weight  = models.FloatField(null=True, blank=True)
    default_rest    = models.IntegerField(default=90)  # seconds

    # Superset grouping — exercises with the same group letter are supersets
    superset_group  = models.CharField(max_length=5, blank=True)
    # e.g. "A" means this exercise is in superset group A

    notes           = models.TextField(blank=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.exercise.name} (Template: {self.template.name})"


# ─────────────────────────────────────────────────────────────────
# WORKOUT SESSION
# ─────────────────────────────────────────────────────────────────

class WorkoutSession(models.Model):
    """
    One workout session. Can be started from a template or blank.
    """
    user          = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="workout_sessions"
    )
    template      = models.ForeignKey(
        WorkoutTemplate,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="sessions",
    )

    date          = models.DateField(default=timezone.localdate)
    category      = models.CharField(
        max_length=50, choices=WorkoutCategory.choices, default=WorkoutCategory.PUSH
    )

    start_time    = models.DateTimeField(null=True, blank=True)
    end_time      = models.DateTimeField(null=True, blank=True)

    # Duration in seconds — computed on finish, stored for fast queries
    duration_seconds = models.IntegerField(null=True, blank=True)

    notes         = models.TextField(blank=True)

    # Mood / energy tracking (1–10 scale)
    energy_level  = models.IntegerField(
        null=True, blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(10)],
    )
    mood_rating   = models.IntegerField(
        null=True, blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(10)],
    )

    # Bodyweight at time of session (useful for bodyweight volume calc)
    bodyweight    = models.FloatField(null=True, blank=True)
    weight_unit   = models.CharField(
        max_length=5, choices=WeightUnit.choices, default=WeightUnit.KG
    )

    is_finished   = models.BooleanField(default=False)

    created_at    = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date", "-start_time"]

    # ── Computed properties ──────────────────────────────────────

    @property
    def total_volume(self):
        """Sum of weight × reps across all completed sets."""
        return sum(
            s.volume
            for we in self.workout_exercises.all()
            for s in we.sets.filter(completed=True)
        )

    @property
    def total_sets_completed(self):
        return sum(
            we.sets.filter(completed=True).count()
            for we in self.workout_exercises.all()
        )

    @property
    def total_reps(self):
        return sum(
            s.reps
            for we in self.workout_exercises.all()
            for s in we.sets.filter(completed=True)
        )

    def finish(self):
        """Call when user taps Finish Workout."""
        self.end_time = timezone.now()
        if self.start_time:
            delta = self.end_time - self.start_time
            self.duration_seconds = int(delta.total_seconds())
        self.is_finished = True
        self.save(update_fields=["end_time", "duration_seconds", "is_finished"])

    def __str__(self):
        return f"{self.user.username} - {self.category} ({self.date})"


# ─────────────────────────────────────────────────────────────────
# WORKOUT EXERCISE (exercise within a session)
# ─────────────────────────────────────────────────────────────────

class WorkoutExercise(models.Model):
    """
    An exercise performed inside a WorkoutSession.
    """
    session   = models.ForeignKey(
        WorkoutSession,
        on_delete=models.CASCADE,
        related_name="workout_exercises",
    )
    exercise  = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    order     = models.PositiveIntegerField(default=0)

    notes         = models.TextField(blank=True)
    is_favorite   = models.BooleanField(default=False)

    # Superset grouping (matches TemplateExercise.superset_group if from template)
    superset_group = models.CharField(max_length=5, blank=True)

    created_at    = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order"]

    @property
    def total_volume(self):
        return sum(s.volume for s in self.sets.filter(completed=True))

    @property
    def best_set(self):
        """Returns the set with the highest volume."""
        completed = self.sets.filter(completed=True)
        if not completed.exists():
            return None
        return max(completed, key=lambda s: s.volume)

    def __str__(self):
        return f"{self.exercise.name} — Session {self.session.id}"


# ─────────────────────────────────────────────────────────────────
# SET
# ─────────────────────────────────────────────────────────────────

class Set(models.Model):
    """
    A single set of an exercise in a session.
    """
    workout_exercise = models.ForeignKey(
        WorkoutExercise,
        on_delete=models.CASCADE,
        related_name="sets",
    )

    set_number  = models.PositiveIntegerField(default=1)

    weight      = models.FloatField(
        default=0, validators=[MinValueValidator(0)]
    )
    reps        = models.IntegerField(
        default=0, validators=[MinValueValidator(0)]
    )
    completed   = models.BooleanField(default=False)

    # RPE: Rate of Perceived Exertion (1–10)
    rpe         = models.FloatField(
        null=True, blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(10)],
    )

    # Rest time actually taken (user may skip early)
    rest_taken  = models.IntegerField(null=True, blank=True)  # seconds
    rest_target = models.IntegerField(default=90)              # seconds

    # Tempo notation: e.g. "3-1-2-0" (eccentric-pause-concentric-pause)
    tempo       = models.CharField(max_length=20, blank=True)

    # Flags
    is_warmup   = models.BooleanField(default=False)
    is_dropset  = models.BooleanField(default=False)
    is_pr       = models.BooleanField(default=False)  # auto-flagged

    completed_at = models.DateTimeField(null=True, blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["set_number"]

    @property
    def volume(self):
        return self.weight * self.reps

    @property
    def estimated_1rm(self):
        """
        Epley formula: 1RM = weight × (1 + reps / 30)
        Only meaningful for reps ≤ 12.
        """
        if self.reps == 0:
            return 0
        if self.reps == 1:
            return self.weight
        return round(self.weight * (1 + self.reps / 30), 2)

    def mark_complete(self):
        self.completed = True
        self.completed_at = timezone.now()
        self.save(update_fields=["completed", "completed_at"])

    def __str__(self):
        tag = " (warmup)" if self.is_warmup else ""
        return f"Set {self.set_number}: {self.weight}kg × {self.reps}{tag}"


# ─────────────────────────────────────────────────────────────────
# PERSONAL RECORDS
# ─────────────────────────────────────────────────────────────────

class PersonalRecord(models.Model):
    """
    Tracks the best performance per exercise per user.
    Auto-updated whenever a Set is completed that beats the record.
    """
    user      = models.ForeignKey(User, on_delete=models.CASCADE, related_name="prs")
    exercise  = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name="prs")

    # The actual set that broke the record
    set_ref   = models.ForeignKey(
        Set, null=True, blank=True, on_delete=models.SET_NULL
    )

    max_weight   = models.FloatField(default=0)
    max_reps     = models.IntegerField(default=0)
    max_volume   = models.FloatField(default=0)   # weight × reps for that set
    max_1rm      = models.FloatField(default=0)   # estimated 1RM

    achieved_at  = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "exercise")

    def __str__(self):
        return (
            f"{self.user.username} PR — {self.exercise.name}: "
            f"{self.max_weight}kg × {self.max_reps}"
        )


# ─────────────────────────────────────────────────────────────────
# WORKOUT HISTORY SNAPSHOT (denormalized for fast dashboard queries)
# ─────────────────────────────────────────────────────────────────

class WorkoutHistorySnapshot(models.Model):
    """
    Denormalized weekly/monthly rollup written after each session finishes.
    Powers progress charts without expensive aggregation on every request.
    """
    user           = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="history_snapshots"
    )
    session        = models.OneToOneField(
        WorkoutSession,
        on_delete=models.CASCADE,
        related_name="snapshot",
    )

    date           = models.DateField()
    category       = models.CharField(max_length=50)

    total_volume   = models.FloatField(default=0)
    total_sets     = models.IntegerField(default=0)
    total_reps     = models.IntegerField(default=0)
    duration_secs  = models.IntegerField(default=0)

    # PRs broken this session
    prs_broken     = models.IntegerField(default=0)

    created_at     = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        return f"Snapshot: {self.user.username} — {self.date}"


# ─────────────────────────────────────────────────────────────────
# AUTO-PROGRESSION SUGGESTION
# ─────────────────────────────────────────────────────────────────

class ProgressionSuggestion(models.Model):
    """
    Generated after each session for next session's target weight/reps.
    Frontend reads this when the user starts a new session.
    """
    user      = models.ForeignKey(User, on_delete=models.CASCADE, related_name="suggestions")
    exercise  = models.ForeignKey(Exercise, on_delete=models.CASCADE)

    # What was done last session
    last_weight    = models.FloatField()
    last_reps      = models.IntegerField()
    last_rpe       = models.FloatField(null=True, blank=True)

    # What we suggest for next session
    suggested_weight = models.FloatField()
    suggested_reps   = models.IntegerField()
    suggested_sets   = models.IntegerField(default=3)

    # Reasoning string shown to user (e.g. "Hit all reps — add 2.5 kg")
    reason           = models.CharField(max_length=255, blank=True)

    progression_type = models.CharField(
        max_length=50,
        choices=ProgressionType.choices,
        default=ProgressionType.DOUBLE,
    )

    generated_at     = models.DateTimeField(auto_now_add=True)
    # Mark True once user accepts and starts next session
    applied          = models.BooleanField(default=False)

    class Meta:
        ordering = ["-generated_at"]
        # One active suggestion per user per exercise
        unique_together = ("user", "exercise", "applied")

    def __str__(self):
        return (
            f"{self.user.username} — {self.exercise.name}: "
            f"{self.suggested_weight}kg × {self.suggested_reps}"
        )