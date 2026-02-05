from django.urls import path
from . import views

urlpatterns = [
    #path('', views.index, name='index'),
    path('create-food/', views.create_food, name='create_food'),
    path('get-foods/', views.get_foods, name='get_foods'),
]