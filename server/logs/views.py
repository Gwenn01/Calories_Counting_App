from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import Http404
from rest_framework.views import APIView
from rest_framework import status
from .models import DailyLog
from .serializers import  LogSerializer
from macros.services import MacrosService
# Create your views here.

class LogsList(APIView):
    """
    List all logs, or create a new log.
    """
    def get(self, request, format=None):
        logs = DailyLog.objects.all()
        serializer = LogSerializer(logs, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = LogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Log created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogsDetail(APIView):
    """
    Retrieve, update or delete a log instance.
    """
    def get_object(self, pk):
        try:
            return DailyLog.objects.get(pk=pk)
        except DailyLog.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        log = self.get_object(pk)
        serializer = LogSerializer(log) 
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request, pk, format=None):
        log = self.get_object(pk)
        serializer = LogSerializer(log, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Log updated successfully"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        log = self.get_object(pk)
        log.delete()
        return Response({"message": "Log Remove successfully"}, status=status.HTTP_204_NO_CONTENT)
    