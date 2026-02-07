from django.urls import path
from . import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('profile/', views.UserProfileList.as_view(), name='profile-list'),
    path('profile/<int:pk>/', views.UserProfileDetail.as_view(), name='profile-list'),
]

urlpatterns = format_suffix_patterns(urlpatterns)