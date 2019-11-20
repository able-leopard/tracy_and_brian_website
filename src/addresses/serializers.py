from django.contrib.auth import get_user_model, authenticate, login, logout
from django.db.models import Q
from django.urls import reverse
from django.utils import timezone

from rest_framework.request import Request
from rest_framework.test import APIRequestFactory
from rest_framework import serializers

from .models import Address

class AddressSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Address
        fields = [
            "id",
            'billing_profile',              
            'address_type',
            'first_name',     
            'last_name',     
            'address_1',     
            'address_2',           
            'city',                        
            'province_or_state',     
            'country',
            'postal_or_zip_code',
            'phone',
        ]
