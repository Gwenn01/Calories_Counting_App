from rest_framework import serializers
from .models import Macros

class MacrosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Macros
        fields = '__all__'

    def validate(self, data):
        if data['calories'] < 0:
            raise serializers.ValidationError("Calories cannot be negative")
        return data