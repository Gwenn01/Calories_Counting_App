from django.urls import path
from . import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('profile/', views.UserProfileList.as_view(), name='profile-list'),
    path('profile-details/', views.UserProfileDetail.as_view(), name='profile-details'),
]

urlpatterns = format_suffix_patterns(urlpatterns)   