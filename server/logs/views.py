from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import DailyLog
from .serializers import  LogSerializer
from users.models import UserProfile
from foods.models import Food
# Create your views here.

@api_view(['POST'])
def create_log(request):
    # Get the data from the request
    data = request.data
    # Create a new log object
    serializer = LogSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response("Log created successfully", status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['GET'])
def get_logs(request):
    # Get logs from the database
    logs = DailyLog.objects.all()
    # Serialize the logs
    serializer = LogSerializer(logs, many=True)
    # Return the serialized logs
    return Response(serializer.data, status=status.HTTP_200_OK)