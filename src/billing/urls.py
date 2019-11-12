from django.urls import path, re_path

from .views import (
        BillingListAPIView,
        BillingUpdateAPIView,
    )

app_name = 'billing-api'

urlpatterns = [
    path('', BillingListAPIView.as_view(), name='billing-list'),
    path('update/', BillingUpdateAPIView.as_view(), name='billing-item-detail'),
 ]
