from django.urls import path
from . import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('workout/profile/', views.WorkoutProfileViewList.as_view(), name='workout-profile-list'),
    path('workout/exercise/', views.ExerciseViewList.as_view(), name='excercise-list'),
    path('workout/exercise/<str:muscle>/', views.ExerciseMuscleViewList.as_view(), name='excercise-muscle-list'),
    path('workout/exercise/<str:program>/', views.ExerciseMuscleViewList.as_view(), name='excercise-program-list'),
]