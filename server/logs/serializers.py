from rest_framework import serializers
from .models import DailyLog

class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyLog
        fields = '__all__'
        
    def validate(self, data):
        quantity = data.get("quantity")
        food = data.get("food")

        if quantity is not None and quantity <= 0:
            raise serializers.ValidationError({
                "quantity": "Quantity must be greater than 0."
            })

        if food and food.calories < 0:
            raise serializers.ValidationError({
                "food": "Food calories cannot be negative."
            })

        return data