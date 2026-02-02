from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    name = models.CharField(max_length=100, blank=True)

    target_calories = models.PositiveIntegerField(null=True, blank=True)
    target_protein = models.PositiveIntegerField(null=True, blank=True)
    target_carbs = models.PositiveIntegerField(null=True, blank=True)
    target_fats = models.PositiveIntegerField(null=True, blank=True)

    age = models.PositiveIntegerField(null=True, blank=True)
    weight = models.PositiveIntegerField(null=True, blank=True)  # kg
    height = models.PositiveIntegerField(null=True, blank=True)  # cm

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username
