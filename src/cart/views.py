from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import generics, permissions, pagination, status

from django.db.models import Q
from .models import Cart
from .permissions import IsOwnerOrReadOnly
from .serializers import CartSerializer

class CartDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset            = Cart.objects.all()
    serializer_class    = CartSerializer

class CartListCreateAPIView(generics.ListCreateAPIView):
    queryset            = Cart.objects.all()
    serializer_class    = CartSerializer
    permission_classes  = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
