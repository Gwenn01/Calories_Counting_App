from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import UserFitnessProfileSerializer

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