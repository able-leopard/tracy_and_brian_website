from django.urls import path, re_path

from .views import (
        BioPhotosListCreateAPIView
    )

app_name = 'bio-api'

urlpatterns = [
    path('', BioPhotosListCreateAPIView.as_view(), name='list-create'),
]