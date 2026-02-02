from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
# Create your views here.
def index(request):
    return HttpResponse("Hello, Geeks! Welcome to your first Django app.")

# ACCOUNTS
def create_account_controller(request):
    try:
        
        return HttpResponse("Create account controller")
    except Exception as e:
        return HttpResponse("Error: " + str(e))