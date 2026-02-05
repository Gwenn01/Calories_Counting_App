import json
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import render
from .models import UserProfile
from .serializers import UserProfileSerializer

# Create your views here.
@api_view(['GET'])
def index(request):
    return Response("Hello World", status=status.HTTP_201_CREATED)

# SAVE THE USER PROFILE
@api_view(['POST'])
def save_profile(request):
    serializer = UserProfileSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(
        {"message": "User created successfully"},
        status=status.HTTP_201_CREATED
    )

# GET USER PROFILE
@api_view(['GET'])  
def get_profile(request):
   user_profile = UserProfile.objects.all()
   serializer = UserProfileSerializer(user_profile, many=True)
   return Response(serializer.data, status=status.HTTP_200_OK)

# UPDATE USER PROFILE
@api_view(['PUT'])
def update_profile(request, id):
    user_profile = UserProfile.objects.get(id=id)
    serializer = UserProfileSerializer(user_profile, data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(
        {"message": "User updated successfully"},
        status=status.HTTP_200_OK
    )