from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'id',  
            'name',
            'age',
            'weight',
            'height',
            'target_calories',
            'target_protein',
            'target_carbs',
            'target_fats',
        ]
    
    def validate(self, data):
        if not data.get('name'):
            raise serializers.ValidationError("Name is required")
        if data.get('target_calories') is not None and data['target_calories'] <= 0:
            raise serializers.ValidationError("Target calories must be greater than 0")
        return data
        