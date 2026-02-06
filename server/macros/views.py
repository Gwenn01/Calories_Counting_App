from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Macros
from .serializers import MacrosSerializer
# Create your views here.

@api_view(['GET'])
def get_macros(request, id):
    macros = Macros.objects.filter(id=id)
    serializer = MacrosSerializer(macros, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

