from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Food
from .serializers import FoodSerializer

# Create your views here.
@api_view(['POST'])
def create_food(request):
    serializer = FoodSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response("Food Inserted Successfully", status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)