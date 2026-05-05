from django.urls import path
from . import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('workout/profile/', views.WorkoutProfileViewList.as_view(), name='workout-profile-list'),
]