from django.urls import path
from . import views

urlpatterns = [
    #path('', views.index, name='index'),
    path('create-log/', views.create_log, name='create_log'),
    path('get-logs/', views.get_logs, name='get_logs'),
]