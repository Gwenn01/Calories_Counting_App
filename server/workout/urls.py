from django.urls import path
from . import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    #workout
    path('workout/profile/', views.WorkoutProfileViewList.as_view(), name='workout-profile-list'),
    path('workout/profile-edit/', views.WorkoutProfileViewDetails.as_view(), name='workout-profile-details'),
    # exercise
    path('workout/exercise/', views.ExerciseViewList.as_view(), name='excercise-list'),
    path('workout/exercise/<str:muscle>/', views.ExerciseMuscleViewList.as_view(), name='excercise-muscle-list'),
    path('workout/exercise-program/<str:program>/', views.ExerciseProgramViewList.as_view(), name='excercise-program-list'),
    #template 
    path('workout/template/', views.WorkoutTemplateViewList.as_view(), name='workout-template-list'),
    path('workout/template/<int:pk>/', views.WorkoutTemplateViewDetails.as_view(), name='workout-template-details'),
    path('workout/exercise-template/', views.TemplateExerciseViewList.as_view(), name='template-exercise-list'),
    path('workout/exercise-template/<int:pk>/', views.TemplateExerciseViewDetails.as_view(), name='template-exercise-details'),
    #sessions
    path('workout/session/', views.WorkoutSessionViewList.as_view(), name='workout-session-list')
]