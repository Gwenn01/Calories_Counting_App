from django.db import models

# Create your models here.
class Food(models.Model):
    name = models.CharField(max_length=100)
    serving = models.CharField(max_length=100)
    calories = models.IntegerField(null=True, blank=True)  
    protein = models.FloatField(null=True, blank=True)
    carbs = models.FloatField(null=True, blank=True)
    fat = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    
