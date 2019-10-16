from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import generics, permissions, pagination, status

from django.db.models import Q
from .models import Painting, PaintingPhoto
from .permissions import IsOwnerOrReadOnly
from .serializers import PaintingSerializer, PaintingPhotoSerializer

class PaintingPageNumberPagination(pagination.PageNumberPagination):
    page_size = 20 #remember to also change this.state.maxItemsPerPage in PaintingList.js if you change this
    page_size_query_param = 'size'
    max_page_size = 20

    def get_paginated_response(self, data):
        author  = False
        user    = self.request.user
        if user.is_authenticated:
            author = True
        context = {
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'count': self.page.paginator.count,
            'author': author,
            'results': data,
        }
        return Response(context)


class PaintingDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset            = Painting.objects.all()
    serializer_class    = PaintingSerializer
    lookup_field        = 'slug'
    permission_classes  = [IsOwnerOrReadOnly]


class PaintingListCreateAPIView(generics.ListCreateAPIView):
    queryset            = Painting.objects.all()
    serializer_class    = PaintingSerializer
    permission_classes  = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class    = PaintingPageNumberPagination

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Found the OR condition filtering here
# https://stackoverflow.com/questions/37540275/django-rest-framework-filter-with-or-condition

    def get_queryset(self):
        # filter the queryset based on the filters applied
        queryList = Painting.objects.all()
        
        size_class  = self.request.query_params.get('size_class', None)
        style       = self.request.query_params.get('style', None)
        series      = self.request.query_params.get('series', None)
        artist      = self.request.query_params.get('artist', None)
        available   = self.request.query_params.get('available', None)

        # for displaying distinct queries by a field, not needed for now
        # https://stackoverflow.com/questions/2466496/select-distinct-values-from-a-table-field
        # distinctList = Painting.objects.order_by().values_list("size_class").distinct()
        # print(distinctList)

        if size_class is not None:
            size_class = size_class.split('|')
            query = Q()
            for x in size_class:
                q = Q(size_class=x)
                query |= q
            queryList = queryList.filter(query)
    
        if style is not None:
            style = style.split('|')
            query = Q()
            for x in style:
                q = Q(style=x)
                query |= q
            queryList = queryList.filter(query)
    
        if series is not None:
            series = series.split('|')
            query = Q()
            for x in series:
                q = Q(series=x)
                query |= q
            queryList = queryList.filter(query)
        
        if artist is not None:
            artist = artist.split('|')
            query = Q()

            for x in artist:
                q = Q(artist=x)
                query |= q
            queryList = queryList.filter(query)
        
        if available:
            queryList = queryList.filter(available = available)

        return queryList


class PaintingPhotosPageNumberPagination(pagination.PageNumberPagination):
    page_size = 20
    page_size_query_param = 'size'
    max_page_size = 20

    def get_paginated_response(self, data):
        author  = False
        user    = self.request.user
        if user.is_authenticated:
            author = True
        context = {
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'count': self.page.paginator.count,
            'author': author,
            'results': data,
        }
        return Response(context)


class PaintingPhotosListCreateAPIView(generics.ListCreateAPIView):
    queryset            = PaintingPhoto.objects.all()
    serializer_class    = PaintingPhotoSerializer
    permission_classes  = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class    = PaintingPhotosPageNumberPagination


    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Found the OR condition filtering here
# https://stackoverflow.com/questions/37540275/django-rest-framework-filter-with-or-condition

    def get_queryset(self):
        # filter the queryset based on the filters applied
        queryList = PaintingPhoto.objects.all()
        
        # title       = self.request.query_params.get('title', None)
        # src         = self.request.query_params.get('src', None)

        return queryList
       
class PaintingPhotosTitleListCreateAPIView(generics.ListCreateAPIView):
    queryset            = PaintingPhoto.objects.all()
    serializer_class    = PaintingPhotoSerializer
    lookup_field        = 'title_id'
    permission_classes  = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
            title_id = self.kwargs['title_id']
            return PaintingPhoto.objects.filter(title_id=title_id)

class PaintingPhotosSpecificDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset            = PaintingPhoto.objects.all()
    serializer_class    = PaintingPhotoSerializer
    lookup_field        = 'id'
    permission_classes  = [IsOwnerOrReadOnly]