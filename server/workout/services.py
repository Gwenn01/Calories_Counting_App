from .models import (
    WorkoutExercise,
    Set,
    WorkoutTemplate,
    WorkoutSession,
    TemplateExercise,
)


class WorkoutServices:

    @staticmethod
    def create_session_from_template(session: WorkoutSession, template: WorkoutTemplate):
        """
        Creates WorkoutExercise + default Sets from a WorkoutTemplate.
        Called right after the session is created.
        """
        template_exercises = template.template_exercises.all().order_by("order")

        for te in template_exercises:
            # 1. Create WorkoutExercise
            workout_exercise = WorkoutExercise.objects.create(
                session=session,
                exercise=te.exercise,
                order=te.order,
                notes=te.notes,
                superset_group=te.superset_group,
            )

            # 2. Create default Sets based on default_sets count
            sets_to_create = [
                Set(
                    workout_exercise=workout_exercise,
                    set_number=set_number,
                    weight=te.default_weight or 0,
                    reps=te.default_reps,
                    rest_target=te.default_rest,
                    completed=False,
                )
                for set_number in range(1, te.default_sets + 1)
            ]

            # bulk_create is more efficient than individual .create() calls
            Set.objects.bulk_create(sets_to_create)