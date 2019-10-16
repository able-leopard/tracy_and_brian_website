from django.urls import path, re_path

from .views import (
        CartDetailAPIView,
        CartListCreateAPIView,
    )

app_name = 'cart-api'

urlpatterns = [
    path('', CartListCreateAPIView.as_view(), name='list-create'),
    # re_path(r'^(?P<slug>[\w-]+)/$', PaintingDetailAPIView.as_view(), name='detail'),
 ]


