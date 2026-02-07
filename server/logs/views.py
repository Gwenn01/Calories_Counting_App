from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import DailyLog
from .serializers import  LogSerializer
from django.contrib.auth.models import User
from users.models import UserProfile
from foods.models import Food
from macros.services import MacrosService
# Create your views here.

@api_view(['POST'])
def create_log(request):
    serializer = LogSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    log = serializer.save()  # uses user from request body

    MacrosService.upsert_today_macros(user=log.user)

    return Response(
        "Log created successfully",
        status=status.HTTP_201_CREATED
    )
        
@api_view(['GET'])
def get_logs(request):
    # Get logs from the database
    logs = DailyLog.objects.all()
    # Serialize the logs
    serializer = LogSerializer(logs, many=True)
    # Return the serialized logs
    return Response(serializer.data, status=status.HTTP_200_OK)