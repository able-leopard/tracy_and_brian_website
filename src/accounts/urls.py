from django.urls import path, re_path

from .views import (
        AccountListAPIView,
        AccountUpdateAPIView,
    )

app_name = 'account-api'

urlpatterns = [
    path('', AccountListAPIView.as_view(), name='account-list'),
    path('update/', AccountUpdateAPIView.as_view(), name='account-item-detail'),
 ]
