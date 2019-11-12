from django.urls import path, re_path

from .views import (
        # AllCartsListCreateAPIView,
        CartListAPIView,
        CartUpdateAPIView,
        CheckoutHomeAPIView,
    )

app_name = 'cart-api'

urlpatterns = [
    path('', CartListAPIView.as_view(), name='cart-list'),
    path('update/', CartUpdateAPIView.as_view(), name='cart-item-detail'),
    path('checkout/', CheckoutHomeAPIView.as_view(), name='checkout-home'),
 ]