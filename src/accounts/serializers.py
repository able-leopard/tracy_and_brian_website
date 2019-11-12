from django.contrib.auth import get_user_model, authenticate, login, logout
from django.db.models import Q
from django.urls import reverse
from django.utils import timezone

from rest_framework.request import Request
from rest_framework.test import APIRequestFactory
from rest_framework import serializers

from .models import GuestEmail


class GuestEmailSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = GuestEmail
        fields = [
            "id",
            "email",
        ]