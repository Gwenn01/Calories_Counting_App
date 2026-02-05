from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model): 
    name = models.CharField(max_length=100, blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    weight = models.PositiveIntegerField(null=True, blank=True)  # kg
    height = models.PositiveIntegerField(null=True, blank=True)  # cm
    target_calories = models.PositiveIntegerField(null=True, blank=True)
    target_protein = models.PositiveIntegerField(null=True, blank=True)
    target_carbs = models.PositiveIntegerField(null=True, blank=True)
    target_fats = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name or "User"



# CREATE MANUALLY WITHOUT SERIALIZER============================================
    def update_from_dict(self, data):
        for field, value in data.items():
            if hasattr(self, field):
                setattr(self, field, value)
        self.save()
    # def update_from_dict(self, data):
    #     self.name = data['name']
    #     self.age = data['age']
    #     self.weight = data['weight']
    #     self.height = data['height']
    #     self.target_calories = data['target_calories']
    #     self.target_protein = data['target_protein']
    #     self.target_carbs = data['target_carbs']
    #     self.target_fats = data['target_fats']

    #     self.save()
    
    
    def to_dict(self):
        data = {
            "name": self.name,
            "age": self.age,
            "weight": self.weight,
            "height": self.height,
            "target_calories": self.target_calories,
            "target_protein": self.target_protein,
            "target_carbs": self.target_carbs,
            "target_fats": self.target_fats,
        }
        return data
