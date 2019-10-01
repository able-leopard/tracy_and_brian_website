from django.urls import path, re_path

from .views import (
        PaintingDetailAPIView,
        PaintingListCreateAPIView,
    )

app_name = 'paintings-api'

urlpatterns = [
    path('', PaintingListCreateAPIView.as_view(), name='list-create'),
    re_path(r'^(?P<slug>[\w-]+)/$', PaintingDetailAPIView.as_view(), name='detail'),
 ]


