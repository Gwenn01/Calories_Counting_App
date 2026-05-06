from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import  (
    Exercise
)
from .serializers import (
    UserFitnessProfileSerializer,
    ExerciseSerializer
)

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
        "legs": ["quads", "hamstrings", "glutes", "calves"],
        "full_body": [
            "chest", "back", "shoulders", "biceps", "triceps",
            "quads", "hamstrings", "glutes", "calves", "core"
        ],
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