from django.db import models
from django.contrib.auth.models import User
from foods.models import Food

class DailyLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    meal_type = models.CharField(max_length=50)
    quantity = models.IntegerField(null=True, blank=True)
    created_at = models.DateField()

    def total_calories(self):
        return self.food.meal_type * self.quantity
