from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('save-profile/', views.save_profile, name='save_profile'),
    path('get-profile/', views.get_profile, name='get_profile')
]