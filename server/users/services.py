# users/services.py
from django.shortcuts import get_object_or_404
from .models import UserProfile

def get_user_profile(user):
    return get_object_or_404(UserProfile, user=user)
