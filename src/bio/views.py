from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import generics, permissions, pagination, status

from .models import BioPhoto
from .serializers import BioPhotoSerializer

# Create your views here.
class BioPhotosListCreateAPIView(generics.ListCreateAPIView):
    queryset            = BioPhoto.objects.all()
    serializer_class    = BioPhotoSerializer
    permission_classes  = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        # filter the queryset if distinct values based on title_id
        queryList = BioPhoto.objects.all().order_by('photo_name').distinct('photo_name')
        
        return queryList