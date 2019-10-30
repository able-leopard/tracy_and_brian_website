from django.urls import path, re_path

from .views import (
        CartListCreateAPIView,
        CartDetailAPIView,
        CartItemDetailAPIView,
    )

from paintings.views import (
    PaintingDetailAPIView
)

app_name = 'cart-api'

urlpatterns = [
    path('', CartListCreateAPIView.as_view(), name='list-create'),
    re_path(r'^(?P<id>[\w-]+)/$', CartDetailAPIView.as_view(), name='cart-detail'),
    re_path(r'^(?P<id>[\w-]+)/(?P<slug>[\w-]+)/$', CartItemDetailAPIView.as_view(), name='cart-item-detail'),
    re_path(r'^(?P<slug>[\w-]+)/$', PaintingDetailAPIView.as_view(), name='detail'),
 ]


