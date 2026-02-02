import json
from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import UserProfile
from django.views.decorators.csrf import csrf_exempt
# Create your views here.
@csrf_exempt
def index(request):
    return HttpResponse("Hello, Geeks! Welcome to your first Django app.")

@csrf_exempt
# ACCOUNTS
def save_profile(request):
    try:
        if request.method != 'POST':
            return JsonResponse("Error: POST request required", status=400)
        
        data = json.loads(request.body)
        
        Profile, created = UserProfile.objects.get_or_create(id=1)
        
        Profile.update_from_dict(data)
        
        if created:
            return JsonResponse({"message": "Profile created"})
        else:
            return JsonResponse({"message": "Profile updated"})
        
    except Exception as e:
        return HttpResponse("Error: " + str(e))

@csrf_exempt  
def get_profile(request):
    try:
        if request.method != 'GET':
            return JsonResponse("Error: GET request required", status=400)

        Profile, created = UserProfile.objects.get_or_create(id=1)
        
        if created:
            return JsonResponse({"message": "Profile not found"}, status=404)

        return JsonResponse(Profile.to_dict(), status=200)
    except Exception as e:
        return HttpResponse("Error: " + str(e))