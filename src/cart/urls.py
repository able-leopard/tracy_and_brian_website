from django.urls import path, re_path

from .views import (
        # AllCartsListCreateAPIView,
        CartListAPIView,
        CartUpdateAPIView,
    )

from paintings.views import (
    PaintingDetailAPIView
)

app_name = 'cart-api'

urlpatterns = [
    # path('', AllCartsListCreateAPIView.as_view(), name='list-create'),
    path('', CartListAPIView.as_view(), name='cart-list'),
    path('update/', CartUpdateAPIView.as_view(), name='cart-item-detail'),
 ]


    # re_path(r'^(?P<id>[\w-]+)/$', CartDetailAPIView.as_view(), name='cart-detail'),
    # re_path(r'^(?P<id>[\w-]+)/(?P<slug>[\w-]+)/$', CartItemDetailAPIView.as_view(), name='cart-item-detail'),
    # re_path(r'^(?P<slug>[\w-]+)/$', PaintingDetailAPIView.as_view(), name='detail'),