from django.contrib.auth import get_user_model, authenticate, login, logout
from django.db.models import Q
from django.urls import reverse
from django.utils import timezone

from rest_framework.request import Request
from rest_framework.test import APIRequestFactory
from rest_framework import serializers

from paintings.models import Painting, PaintingPhoto
from .models import Cart
from paintings.serializers import PaintingSerializer

class MyPaintingPhotoSerializer(serializers.ModelSerializer):


    class Meta:
        model = PaintingPhoto
        
        fields =[
            'src',
        ]

class MyPaintingSerializer(serializers.ModelSerializer):
    painting_url             = serializers.HyperlinkedIdentityField(
                                view_name='paintings-api:detail',
                                read_only=True,
                                lookup_field='slug'
                                )
    srcs                    = MyPaintingPhotoSerializer(many=True, read_only=True)
    

    class Meta:
        model = Painting
        fields = [
            'id',
            'title',  
            'painting_url',
            'price',
            'srcs',    
            'slug',                         
        ]


class CartSerializer(serializers.ModelSerializer):
    
    # url             = serializers.HyperlinkedIdentityField(
    #                         view_name='cart-api:cart-detail',
    #                         read_only=True,
    #                         lookup_field='id',
    #                         )
    # products     = PaintingSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = [
            "id",
            # "url",
            "products",
            "sub_total",
            "shipping",
            "total",
            "updated",
            "timestamp",
        ]



# Answer for making hyperlinked id field
# https://stackoverflow.com/questions/36697088/how-to-add-an-url-field-to-a-serializer-with-django-rest-framework

# AssertionError: `HyperlinkedIdentityField` requires the request in the serializer context
# https://stackoverflow.com/questions/34438290/assertionerror-hyperlinkedidentityfield-requires-the-request-in-the-serialize
