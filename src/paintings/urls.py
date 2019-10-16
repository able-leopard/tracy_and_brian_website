from django.urls import path, re_path

from .views import (
        PaintingDetailAPIView,
        PaintingListCreateAPIView,
        PaintingPhotosListCreateAPIView,
        PaintingPhotosTitleListCreateAPIView,
        PaintingPhotosSpecificDetailAPIView,
    )

app_name = 'paintings-api'

urlpatterns = [
    path('', PaintingListCreateAPIView.as_view(), name='list-create'),
    re_path(r'^(?P<slug>[\w-]+)/$', PaintingDetailAPIView.as_view(), name='detail'),
    path('photos', PaintingPhotosListCreateAPIView.as_view(), name='photos-list-create'),
    re_path(r'^photos/(?P<title_id>[\w-]+)/$', PaintingPhotosTitleListCreateAPIView.as_view(), name='photos-title-list'),
    re_path(r'^photosid/(?P<id>[\w-]+)/$', PaintingPhotosSpecificDetailAPIView.as_view(), name='photos-specific-detail'),
 ]


