from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User
from foods.models import Food

class DailyLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    servings = models.FloatField(default=1)

    def total_calories(self):
        return self.food.calories * self.servings
