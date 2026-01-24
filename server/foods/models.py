from django.db import models

# Create your models here.
class Food(models.Model):
    name = models.CharField(max_length=100)
    calories = models.IntegerField()  # per serving
    protein = models.FloatField(null=True, blank=True)
    carbs = models.FloatField(null=True, blank=True)
    fat = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.name
