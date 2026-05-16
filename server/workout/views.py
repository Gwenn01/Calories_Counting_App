from django.utils import timezone
from django.db.models import Max
from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import  (
    Exercise,
    UserFitnessProfile,
    TemplateExercise,
    WorkoutTemplate, 
    WorkoutSession,
    WorkoutExercise,
    Set
)
from .serializers import (
    SetUpdateSerializer,
    UserFitnessProfileSerializer,
    ExerciseSerializer,
    WorkoutTemplateSerializer,
    TemplateExerciseSerializer,
    WorkoutSessionCreateSerializer,
    WorkoutSessionListSerializer,
    WorkoutSessionDetailSerializer,
    WorkoutSessionUpdateSerializer,
    WorkoutExerciseSerializer,
    WorkoutExerciseUpdateSerializer,
    SetSerializer,
    SetCreateSerializer,
    SetUpdateSerializer,
)
from .services import WorkoutServices
from users.models import UserProfile

# WORKOUT PROFILE ===================================================================================
# Create your views here.
class WorkoutProfileViewList(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        try:
            user.fitness_profile
            serializer = UserFitnessProfileSerializer(user.fitness_profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response(
                {"message": "You don't have a workout profile"},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def post(self, request):
        user = request.user

        try:
            user.fitness_profile
            return Response(
                {"message": "You already have a workout profile"},
                status=400
            )

        except ObjectDoesNotExist:
            serializer = UserFitnessProfileSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=user)
                return Response(serializer.data, status=201)

            return Response(serializer.errors, status=400)
        
class WorkoutProfileViewDetails(APIView):
    permission_classes = [IsAuthenticated]
    
    def put(self, request):
        user = request.user
        try:
            user.fitness_profile
            serializer = UserFitnessProfileSerializer(user.fitness_profile, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)               
        except ObjectDoesNotExist:
            return Response(
                {"message": "You don't have a workout profile"},
                status=400
            )

    def delete(self, request):
        user = request.user
        try:
            user.fitness_profile.delete()
            return Response(
                {"message": "Your workout profile has been deleted"},
        )
        except ObjectDoesNotExist:
            return Response(
                {"message": "You don't have a workout profile"},
                status=400
            )
        
# EXERCISE ============================================================================
class ExerciseViewList(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        exercises = Exercise.objects.all()
        serializer = ExerciseSerializer(exercises, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# exercise filter base on the muscle group
class ExerciseMuscleViewList(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, muscle):
        exercises = Exercise.objects.filter(muscle_group=muscle)
        serializer = ExerciseSerializer(exercises, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
# exercise filter base on the program
class ExerciseProgramViewList(APIView):
    permission_classes = [IsAuthenticated]
    
    PROGRAM_TO_MUSCLES = {
        "push": ["chest", "shoulders", "triceps"],
        "pull": ["back", "biceps", "forearms"],
        "legs": ["quads", "hamstrings", "glutes", "calves", "core"],
        "full_body": [
            "chest", "back", "shoulders", "biceps", "triceps",
            "quads", "hamstrings", "glutes", "calves", "core"
        ],
        "anterior": ["chest", "shoulders", "triceps", "quads", "core"],
        "posterior": ["back", "biceps", "hamstrings", "glutes", "calves"],
        "upper": ["chest", "back", "shoulders", "biceps", "triceps"],
        "lower": ["quads", "hamstrings", "glutes", "calves"],
        "cardio": ["cardio"],
    }
    
    def get(self, request, program):
        if program not in self.PROGRAM_TO_MUSCLES:
            return Response({"error": "Invalid program"}, status=400)

        muscles = self.PROGRAM_TO_MUSCLES[program]
        print(muscles)
        exercises = Exercise.objects.filter(
            muscle_group__in=muscles
        )
        serializer = ExerciseSerializer(exercises, many=True)
        return Response(serializer.data, status=200)
    
# TEMPLATE WORKOUT =========================================================
class WorkoutTemplateViewList(APIView):
     permission_classes = [IsAuthenticated]
     
     def get(self, request):
        templates = WorkoutTemplate.objects.filter(user=request.user)
        serializer = WorkoutTemplateSerializer(templates, many=True)
        return Response(serializer.data, status=200)
     
     def post(self, request):
        serializer = WorkoutTemplateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    

class WorkoutTemplateViewDetails(APIView):
     permission_classes = [IsAuthenticated]
     
     def get_object(self, pk):
        try:
            return WorkoutTemplate.objects.get(pk=pk)
        except WorkoutTemplate.DoesNotExist:
            return None

     def get(self, request, pk):
        template = self.get_object(pk)
        if not template:
            return Response({"error": "Template not found"}, status=404)
        serializer = WorkoutTemplateSerializer(template)
        return Response(serializer.data, status=200)

     def put(self, request, pk):
        template = self.get_object(pk)
        serializer = WorkoutTemplateSerializer(template, data=request.data) 
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    
     def delete(self, request, pk):
        template = self.get_object(pk)
        if not template:
            return Response({"error": "Template not found"}, status=404)
        template.delete()
        return Response(status=204)
    
class TemplateExerciseViewList(APIView):
     permission_classes = [IsAuthenticated]

     def post(self, request):
        serializer = TemplateExerciseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)    
    
class TemplateExerciseViewDetails(APIView):
     permission_classes = [IsAuthenticated]
     
     def get_object(self, pk):
        try:
            return TemplateExercise.objects.get(pk=pk)
        except TemplateExercise.DoesNotExist:
            return None

     def get(self, request, pk):
        template = self.get_object(pk)
        if not template:
            return Response({"error": "Template exercise not found"}, status=404)
        serializer = TemplateExerciseSerializer(template)
        return Response(serializer.data, status=200)

     def put(self, request, pk):
        template = self.get_object(pk)
        serializer = TemplateExerciseSerializer(template, data=request.data) 
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

     def delete(self, request, pk):
        template = self.get_object(pk)
        if not template:
            return Response({"error": "Template exercise not found"}, status=404)
        template.delete()
        return Response(status=204)
    
#SESSION WORKOUT =========================================================
class WorkoutSessionViewList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sessions = WorkoutSession.objects.filter(
            user=request.user
        )
        serializer = WorkoutSessionDetailSerializer(
            sessions,
            many=True
        )
        return Response(serializer.data, status=200)

    def post(self, request):
        user = request.user

        serializer = WorkoutSessionCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_profile = UserProfile.objects.get(user=user)
        fitness_profile = UserFitnessProfile.objects.get(user=user)

        template = serializer.validated_data["template"]

        # 1. Save session
        session = serializer.save(
            user=user,
            bodyweight=user_profile.weight,
            weight_unit=fitness_profile.weight_unit,
            category=template.category,
            start_time=timezone.now(),
        )

        # 2. Create exercises + sets from template
        WorkoutServices.create_session_from_template(session, template)

        # 3. Return full session with exercises
        return Response(
            WorkoutSessionDetailSerializer(session).data,
            status=201
        )
        
class WorkoutSessionPerDateView(APIView):
    permission_classes = [IsAuthenticated]  # ← fix: needs to be a list

    def get(self, request, date):
        user = request.user
        sessions = WorkoutSession.objects.filter(user=user,  date=date)
        serializer = WorkoutSessionDetailSerializer(sessions, many=True)
        return Response(serializer.data, status=200)
        
class WorkoutSessionViewDetails(APIView):
    permission_classes = [IsAuthenticated]  # ← fix: needs to be a list

    def get_object(self, pk, user):
        try:
            return WorkoutSession.objects.get(id=pk, user=user)
        except WorkoutSession.DoesNotExist:
            return None

    def get(self, request, pk):
        session = self.get_object(pk, request.user)
        if not session:
            return Response({"error": "Session not found"}, status=404)
        serializer = WorkoutSessionDetailSerializer(session)
        return Response(serializer.data, status=200)

    def put(self, request, pk):
        session = self.get_object(pk, request.user)
        if not session:
            return Response({"error": "Session not found"}, status=404)

        serializer = WorkoutSessionUpdateSerializer(
            session, data=request.data, partial=True
        )
        if serializer.is_valid():
            # If finishing the session, call finish() first
            # to compute end_time and duration_seconds
            if request.data.get("is_finished") and not session.is_finished:
                session.finish()  # ← sets end_time + duration_seconds + is_finished

            serializer.save()
            return Response(
                WorkoutSessionDetailSerializer(session).data,
                status=200
            )
        return Response(serializer.errors, status=400)
    
    def delete(self, request, pk):
        session = self.get_object(pk, request.user)
        if not session:
            return Response({"error": "Session not found"}, status=404)

        # Prevent deleting an already finished session
        if session.is_finished:
            return Response(
                {"error": "Cannot delete a finished session."},
                status=400
            )
        session.delete()
        return Response(status=204)
        
# WORKOUT EXERCISE AND SETS ==========================================================

class WorkoutExerciseViewDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return WorkoutExercise.objects.get(
                id=pk,
                session__user=user  # ← ensure ownership via session
            )
        except WorkoutExercise.DoesNotExist:
            return None

    def get(self, request, pk):
        exercise = self.get_object(pk, request.user)
        if not exercise:
            return Response({"error": "Exercise not found"}, status=404)
        serializer = WorkoutExerciseSerializer(exercise)
        return Response(serializer.data, status=200)

    def put(self, request, pk):
        exercise = self.get_object(pk, request.user)
        if not exercise:
            return Response({"error": "Exercise not found"}, status=404)

        serializer = WorkoutExerciseUpdateSerializer(
            exercise, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                WorkoutExerciseSerializer(exercise).data,
                status=200
            )
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        exercise = self.get_object(pk, request.user)
        if not exercise:
            return Response({"error": "Exercise not found"}, status=404)
        exercise.delete()
        return Response(status=204)


# ─────────────────────────────────────────────────────────────────
# SET VIEWS
# ─────────────────────────────────────────────────────────────────

class SetViewDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return Set.objects.get(
                pk=pk,
                workout_exercise__session__user=user  # ← ownership chain
            )
        except Set.DoesNotExist:
            return None

    def get(self, request, pk):
        set_obj = self.get_object(pk, request.user)
        if not set_obj:
            return Response({"error": "Set not found"}, status=404)
        serializer = SetSerializer(set_obj)
        return Response(serializer.data, status=200)

    def put(self, request, pk):
        set_obj = self.get_object(pk, request.user)
        if not set_obj:
            return Response({"error": "Set not found"}, status=404)

        serializer = SetUpdateSerializer(
            set_obj, data=request.data, partial=True
        )
        if serializer.is_valid():
            # If marking completed, use mark_complete() to also set completed_at
            if request.data.get("completed") and not set_obj.completed:
                set_obj.mark_complete()

            serializer.save()
            return Response(SetSerializer(set_obj).data, status=200)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        set_obj = self.get_object(pk, request.user)
        if not set_obj:
            return Response({"error": "Set not found"}, status=404)
        set_obj.delete()
        return Response(status=204)


# ─────────────────────────────────────────────────────────────────
# ADD EXERCISE TO EXISTING SESSION
# ─────────────────────────────────────────────────────────────────

class WorkoutExerciseCreateView(APIView):
    """Add a new exercise to an active session."""
    permission_classes = [IsAuthenticated]

    def post(self, request, session_pk):
        try:
            session = WorkoutSession.objects.get(
                pk=session_pk,
                user=request.user,
                is_finished=False  # ← can't add to finished session
            )
        except WorkoutSession.DoesNotExist:
            return Response({"error": "Session not found or already finished"}, status=404)

        exercise_id = request.data.get("exercise_id")
        sets_count  = request.data.get("sets", 3)
        reps        = request.data.get("reps", 10)
        weight      = request.data.get("weight", 0)
        rest_target = request.data.get("rest_target", 90)
        notes       = request.data.get("notes", "")

        try:
            exercise = Exercise.objects.get(pk=exercise_id)
        except Exercise.DoesNotExist:
            return Response({"error": "Exercise not found"}, status=404)

        # Get next order
        last_order = session.workout_exercises.aggregate(
            max_order=Max("order")
        )["max_order"] or 0

        workout_exercise = WorkoutExercise.objects.create(
            session=session,
            exercise=exercise,
            order=last_order + 1,
            notes=notes,
        )

        # Create default sets
        Set.objects.bulk_create([
            Set(
                workout_exercise=workout_exercise,
                set_number=i,
                weight=weight,
                reps=reps,
                rest_target=rest_target,
                completed=False,
            )
            for i in range(1, sets_count + 1)
        ])

        return Response(
            WorkoutExerciseSerializer(workout_exercise).data,
            status=201
        )


# ─────────────────────────────────────────────────────────────────
# ADD SET TO EXISTING EXERCISE
# ─────────────────────────────────────────────────────────────────

class SetCreateView(APIView):
    """Add a new set to an existing workout exercise."""
    permission_classes = [IsAuthenticated]

    def post(self, request, exercise_pk):
        try:
            workout_exercise = WorkoutExercise.objects.get(
                pk=exercise_pk,
                session__user=request.user,
                session__is_finished=False,
            )
        except WorkoutExercise.DoesNotExist:
            return Response({"error": "Exercise not found or session finished"}, status=404)

        # Auto-increment set_number
        last_set_number = workout_exercise.sets.aggregate(
            max_set=Max("set_number")
        )["max_set"] or 0

        # Copy last set's weight/reps as default
        last_set = workout_exercise.sets.last()

        new_set = Set.objects.create(
            workout_exercise=workout_exercise,
            set_number=last_set_number + 1,
            weight=last_set.weight if last_set else request.data.get("weight", 0),
            reps=last_set.reps if last_set else request.data.get("reps", 10),
            rest_target=last_set.rest_target if last_set else request.data.get("rest_target", 90),
            completed=False,
        )

        return Response(SetSerializer(new_set).data, status=201)
        
        
        
        