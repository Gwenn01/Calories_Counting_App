from datetime import datetime
from rest_framework.permissions import IsAuthenticated
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
    permission_classes = [IsAuthenticated]
    def get_user(self):
        return self.request.user
        
    def get(self, request, format=None):
        logs = DailyLog.objects.filter(user=request.user)
        print("AUTH USER:", request.user, request.user.id)

        date = request.query_params.get("date")
        meal_type = request.query_params.get("meal_type")
        
        #get log base on date
        if date and meal_type:
            try:
                parsed_date = datetime.strptime(date, "%Y-%m-%d").date()
                logs = logs.filter(created_at=parsed_date, meal_type=meal_type)
            except ValueError:
                return Response(
                    {"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST
                )
        elif date:
            try:
                parsed_date = datetime.strptime(date, "%Y-%m-%d").date()
                logs = logs.filter(created_at=parsed_date)
            except ValueError:
                return Response(
                    {"error": "Date must be in YYYY-MM-DD format"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        elif meal_type:
            logs = logs.filter(meal_type=meal_type)
        # serialize it before returning
        serializer = LogSerializer(logs, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = LogSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            # now every time the user add food log update their macros
            MacrosService.upsert_today_macros(self.get_user())
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
    