import json
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404 
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import render
from .models import UserProfile
from .serializers import UserProfileSerializer

# Create your views here.
class UserProfileList(APIView):

    def get(self, request):
        user_profile = UserProfile.objects.all()
        serializer = UserProfileSerializer(user_profile, many=True)
        return Response(serializer.data)

    def post(self, request):
        permission_classes = [AllowAny]
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"Message": "User profile saved successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserProfileDetail(APIView):
    permission_classes = [IsAuthenticated]
    def get_object(self):
        return get_object_or_404(
            UserProfile,
            user=self.request.user
        )

    def get(self, request):
        user_profile = self.get_object()
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data)

    def put(self, request): 
        user_profile = self.get_object()
        serializer = UserProfileSerializer(user_profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"Message": "User updated successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        user_profile = self.get_object()
        user_profile.delete()
        return Response({"Message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        
