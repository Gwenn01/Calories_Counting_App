from django.urls import path
from . import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    #path('', views.index, name='index'),
    path('foods/', views.FoodList.as_view(), name='foods-list'),
    path('foods/<int:pk>/', views.FoodDetail.as_view(), name='food-details'),
    path('food-bot/', views.FoodBotViews.as_view(), name='food-bot'),
    path('food-bar-code/', views.FoodBarCodeViews.as_view(), name='food-bar-code'),
    path('food-scan/', views.FoodScanViews.as_view(), name='food-scan'),
]

urlpatterns = format_suffix_patterns(urlpatterns)