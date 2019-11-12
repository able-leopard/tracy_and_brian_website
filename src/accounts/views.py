from rest_framework.request import Request
from rest_framework.test import APIRequestFactory
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import generics, permissions, pagination, status

from django.views import View
from django.contrib.auth import authenticate, login, get_user_model
from django.http import HttpResponse
from django.shortcuts import render,redirect
from django.utils.http import is_safe_url
from .models import GuestEmail
from billing.models import BillingProfile
from .serializers import GuestEmailSerializer

"""
only use POST from AccountUpdateAPIView once
after have to use PUT from AccountListAPIView
need to either link a foreign key to Billing model or update the existing email somehow
"""

class AccountListAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    This is the View for a specific cart
    """

    #this is the queryset of all carts as a list of objects (not really needed)
    queryset            = GuestEmail.objects.all()
    serializer_class    = GuestEmailSerializer
    lookup_field        = 'id'   
    permission_classes  = [permissions.AllowAny]

    
    def get(self, request, pk=None, *args, **kwargs):

        account_obj, new_obj        = GuestEmail.objects.new_or_get(request)        
        serializer                  = GuestEmailSerializer(account_obj)
        print(request.session.items())

        return Response(serializer.data)

    #we have the put method here but didn't really use it since i made
    #the POST method in AccountUpdateAPIView do pretty much the same time
    def put(self, request, pk=None, *args, **kwargs):

        new_email = request.data['email']

        #getting the account object and updating the email
        account_obj, new_obj        = GuestEmail.objects.new_or_get(request)   
        account_obj.email = new_email
        account_obj.save() 

        #getting the billing object and updating the email
        billing_obj, new_obj        = BillingProfile.objects.new_or_get(request)
        billing_obj.email = new_email
        billing_obj.save()

        serializer                  = GuestEmailSerializer(account_obj)

        return Response(serializer.data)

class AccountUpdateAPIView(APIView):
    """
    This is the View for a specific item in a specific cart
    We're mainly using the post method here, the get is not really used but just for show
    """
    permission_classes  = [permissions.AllowAny]
    serializer_class    = GuestEmailSerializer

    def get(self, request, pk=None, *args, **kwargs):

        """
        GET METHOD not used here
        """
     
        return redirect("account-api:account-list")

    def post(self, request, pk=None, *args, **kwargs):

        # this line takes the data coming from the front end        
        email = request.data['email']

        # getting the object if it exists
        account_obj, new_obj = GuestEmail.objects.new_or_get(request) 

        # if it exits we're updating the account object, we have to update the billing object also
        if new_obj is False:
            account_obj.email = email
            account_obj.save()

            billing_obj, new_obj        = BillingProfile.objects.new_or_get(request)
            billing_obj.email           = email
            billing_obj.save()
        else:
            account_obj = GuestEmail.objects.create(email=email)
            request.session['account_id'] = account_obj.id

        serializer                      = GuestEmailSerializer(account_obj)

        return Response(serializer.data)

            