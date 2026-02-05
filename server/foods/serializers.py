from rest_framework import serializers
from .models import Food

class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = [
            'name',
            'serving',
            'calories',
            'protein',
            'carbs',
            'fat',
        ]
        
    def validate(self, data):
        if data.get('calories') < 0 or data.get('protein', 0) < 0 or data.get('carbs', 0) < 0 or data.get('fat', 0) < 0:
            raise serializers.ValidationError("Macros cannot be negative")
        return data

