from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    #path('', views.index, name='index'),
    path('food-logs/', views.LogsList.as_view(), name='food-logs'),
    #path('food-logs/<int:user_id>', views.LogsList.as_view(), name='food-logs'),
    path('food-logs/<int:pk>/', views.LogsDetail.as_view(), name='food-logs-detail'),
]

urlpatterns = format_suffix_patterns(urlpatterns)