from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Food
from .serializers import FoodSerializer
from .foodbot_services import FoodBotServices
from .barcode_services import BarcodeServices
from core import settings

# Create your views here.
# CREATE MANUAL FOOD =======================================================
class FoodList(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self, user):
        return Food.objects.filter(created_by=user)
    
    def get(self, request):
        user = self.request.user
        foods = self.get_object(user)
        serializer = FoodSerializer(foods, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = FoodSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Food created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# EDIT AND DELETE FOOD =========================================================== 
class FoodDetail(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk):
        return get_object_or_404(Food, pk=pk)

    def get(self, request, pk):
        food = self.get_object(pk)
        serializer = FoodSerializer(food)
        return Response(serializer.data)
    
    def put(self, request, pk):
        food = self.get_object(pk)
        serializer = FoodSerializer(food, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Food updated successfully"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        food = self.get_object(pk)
        food.delete()
        return Response({"message": "Food deleted successfully"}, status=status.HTTP_200_OK)

# FOOD BOT VIEWS ======================================================================================
class FoodBotViews(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        food_prompt = request.data.get('food_prompt')
        print("FOOD PROMPT:", food_prompt)  # check if prompt is received
        try:
            result = FoodBotServices.get_nutrition_data(food_prompt)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            print("ERROR:", str(e))  # <-- exact error here
            import traceback
            traceback.print_exc()  # full stack trace
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
# FOOD QR CODE VIEWS ======================================================================================
class FoodBarCodeViews(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        food_barcode = request.data.get('food_barcode')
        # Validate barcode is present
        if not food_barcode:
            return Response(
                {"error": "food_barcode is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        #  Pass credentials from settings
        result = BarcodeServices.fetch_food(
            barcode=food_barcode,
            nutritionix_app_id=settings.NUTRITIONIX_APP_ID,
            nutritionix_app_key=settings.NUTRITIONIX_APP_KEY,
            usda_api_key=settings.USDA_API_KEY,
        )
        if not result:
            return Response(
                {"error": f"Food with barcode '{food_barcode}' not found in any source."},
                status=status.HTTP_404_NOT_FOUND  
            )
        return Response(result, status=status.HTTP_200_OK)


# FOOD PICTURE SCAN VIEWS =================================================================================