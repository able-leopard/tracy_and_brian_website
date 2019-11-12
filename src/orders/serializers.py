from django.contrib.auth import get_user_model, authenticate, login, logout

from rest_framework.request import Request
from rest_framework.test import APIRequestFactory
from rest_framework import serializers

from .models import Order
from addresses.models import Address
from accounts.models import GuestEmail
from billing.models import BillingProfile
from cart.models import Cart
from paintings.models import Painting

from addresses.serializers import AddressSerializer
from accounts.serializers import GuestEmailSerializer
from billing.serializers import BillingProfileSerializer
from cart.serializers import CartSerializer
from paintings.serializers import PaintingSerializer


class OrderSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Order
        fields = [
            "id",
            "billing_profile",
            "order_id",            
            "shipping_address",  
            "billing_address",     
            "cart",                
            "status",              
            "shipping_total",     
            "total",               
            "active"              
        ]

class OrderMultiModelSerializer(serializers.ModelSerializer):
    
    orders              = OrderSerializer(many=True)
    addresses           = AddressSerializer(many=True)
    accounts            = GuestEmailSerializer(many=True)
    billing_profiles    = BillingProfileSerializer(many=True)
    carts               = CartSerializer(many=True)
    paintings           = PaintingSerializer(many=True)           
