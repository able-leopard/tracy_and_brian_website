from django.urls import path, re_path

from .views import (
        AddressListAPIView,
        ShippingAddressUpdateAPIView,
        BillingAddressUpdateAPIView,
    )

app_name = 'address-api'

urlpatterns = [
    path('', AddressListAPIView.as_view(), name='address-list'),
    path('update-shipping/', ShippingAddressUpdateAPIView.as_view(), name='shipping-address'),
    path('update-billing/', BillingAddressUpdateAPIView.as_view(), name='billing-address'),
 ]
