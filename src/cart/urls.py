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
    path('', CartListAPIView.as_view(), name='cart-list'),
    path('update/', CartUpdateAPIView.as_view(), name='cart-item-detail'),
 ]