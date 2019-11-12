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

from billing.models import BillingProfile
from .models import Address
from .serializers import AddressSerializer


class AddressListAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    Displays the most recent address object. Is not really used anyway except for when
    ShippingAddressUpdateAPIView & BillingAddressUpdateAPIView's POST method at the end redirects to this

    """

    #this is the queryset of all carts as a list of objects (not really needed)
    queryset            = Address.objects.all()
    serializer_class    = AddressSerializer
    lookup_field        = 'id'   
    permission_classes  = [permissions.AllowAny]
    
    def get(self, request, pk=None, *args, **kwargs):

        address_obj, new_obj        = Address.objects.new_or_get(request)        
        serializer                  = AddressSerializer(address_obj)

        return Response(serializer.data)

"""
FOR FUTURE REFERENCE: The difference between ShippingAddressUpdateAPIView and BillingAddressUpdateAPIView

mainly the POST method is different.
Because "Address.objects.new_or_get(request)" is called first due to the flow of our front end: 
( ShippingAddressForm.js -> getAddress() ), it created an empty address object

ShippingAddressUpdateAPIView's POST method is called next after the user submits the shipping info from the frontend  ( ShippingAddressForm.js -> updateAddress() )
we then retrieve this empty object with its Address.objects.new_or_get(request) in ShippingAddressUpdateAPIView's POST method
we then append to this object using the data submitted by the user from the frontend and saves it after via "address_obj.save()"

When BillingAddressUpdateAPIView is finally called, there is no empty object
the main difference is that we're getting the data from the frontend and created an entirely new object instead of appending to an empty object
this is done with "Address.objects.create()"
"""

class ShippingAddressUpdateAPIView(APIView):

    permission_classes  = [permissions.AllowAny]
    serializer_class    = AddressSerializer

    def get(self, request, pk=None, *args, **kwargs):

        # retrieving previous shipping address object if available
        shipping_address_id = request.session.get('shipping_address_id')
        qs = Address.objects.filter(id=shipping_address_id)
 
        if qs.count() == 1:
            address_obj         = qs.first()
            serializer          = AddressSerializer(address_obj)
        
        # if unavailable, create new empty address object
        else:
            address_obj, new_obj        = Address.objects.new_or_get(request) #1nd empty obj created due to not shipping_address_id       
            serializer                  = AddressSerializer(address_obj)
            print("printing ShippingAddressUpdateAPIView GET response")
            print(address_obj)
            print(new_obj)
            print(request.session.items())

        return Response(serializer.data)

    def post(self, request, pk=None, *args, **kwargs):

        address_type                    = request.data['address_type']
        address_1                       = request.data['address_1']
        city                            = request.data['city']
        province_or_state               = request.data['province_or_state']
        country                         = request.data['country']
        postal_or_zip_code              = request.data['postal_or_zip_code']

        # checks session to see if there was previous shipping_address object created
        shipping_address_id = request.session.get('shipping_address_id') 
        
        qs = Address.objects.filter(id=shipping_address_id)
        
        # get retrieve the previous shipping object and append
        if qs.count() == 1:
            address_obj = qs.first()

            address_obj.address_type        = address_type
            address_obj.address_1           = address_1
            address_obj.city                = city
            address_obj.province_or_state   = province_or_state
            address_obj.country             = country
            address_obj.postal_or_zip_code  = postal_or_zip_code
            address_obj.save()  
            
            # retrieve existing billing profile object, if not create new object
            billing_profile, billing_profile_created = BillingProfile.objects.new_or_get(request) 

            if billing_profile is not None:
                
                #appending the billing_profile FK to the address object
                address_obj.billing_profile = billing_profile
                address_obj.save()
           
            else:
                print("Error - your address did not get saved")

            #the setter for shipping_address_id
            # request.session[address_type + "_address_id"] = address_obj.id
            serializer          = AddressSerializer(address_obj)
            
        # if no shipping address object was created we create a new object
        else:
            
            address_obj, new_obj        = Address.objects.new_or_get(request)
            print("calling Address.objects.new_or_get again")            
            print(address_obj)
            print(new_obj)
            # address_id                      = request.session.get('address_id') 
            # qs                              = Address.objects.filter(id=address_id)
            
            # if qs.count() == 1:
            # address_obj                     = qs.first()
            
            address_obj.address_type        = address_type
            address_obj.address_1           = address_1
            address_obj.city                = city
            address_obj.province_or_state   = province_or_state
            address_obj.country             = country
            address_obj.postal_or_zip_code  = postal_or_zip_code
            address_obj.save()  

            # else:
            #     address_obj = Address.objects.create(
            #                                         address_type=address_type,
            #                                         address_1=address_1,
            #                                         city=city,
            #                                         province_or_state=province_or_state,
            #                                         country=country,
            #                                         postal_or_zip_code=postal_or_zip_code
            #                                         )
            
            # retrieve existing billing profile object, if not create new object
            billing_profile, billing_profile_created = BillingProfile.objects.new_or_get(request) 

            if billing_profile is not None:
                
                #appending the billing_profile FK to the address object
                address_obj.billing_profile = billing_profile
                address_obj.save()

            else:
                print("Error - your address did not get saved")

            #the setter for shipping_address_id
            request.session[address_type + "_address_id"] = address_obj.id
            serializer          = AddressSerializer(address_obj)

        return Response(serializer.data)

class BillingAddressUpdateAPIView(APIView):

    permission_classes  = [permissions.AllowAny]

    def get(self, request, pk=None, *args, **kwargs):
        
        billing_address_id = request.session.get('billing_address_id')
        billing_address_qs = Address.objects.filter(id=billing_address_id)

        shipping_address_id = request.session.get('shipping_address_id')
        shipping_address_qs = Address.objects.filter(id=shipping_address_id)
        print("printing shipping address qs transferred to billing")
        print(shipping_address_qs)

        # retrieving previous billing address object if available        
        if billing_address_qs.count() == 1:
            address_obj         = billing_address_qs.first()
            serializer          = AddressSerializer(address_obj)
        
        # if no previous billing object, when we can retrieve the shipping object
        elif shipping_address_qs.count() == 1:
            address_obj         = shipping_address_qs.first()
            serializer          = AddressSerializer(address_obj)
        
        # if no existing billing or shipping object, then create new empty address object
        else:
            address_obj, new_obj        = Address.objects.new_or_get(request)        
            serializer                  = AddressSerializer(address_obj)

        return Response(serializer.data)

    def post(self, request, pk=None, *args, **kwargs):

        address_type                    = request.data['address_type']
        address_1                       = request.data['address_1']
        city                            = request.data['city']
        province_or_state               = request.data['province_or_state']
        country                         = request.data['country']
        postal_or_zip_code              = request.data['postal_or_zip_code']

        # checks session to see if there was previous billing_address object created
        billing_address_id = request.session.get('billing_address_id')

        qs = Address.objects.filter(id=billing_address_id)
        
        # if previous billing address object exists, retrieve the previous shipping object and append
        if qs.count() == 1:
            address_obj = qs.first()
            address_obj.address_type        = address_type
            address_obj.address_1           = address_1
            address_obj.city                = city
            address_obj.province_or_state   = province_or_state
            address_obj.country             = country
            address_obj.postal_or_zip_code  = postal_or_zip_code
            address_obj.save()  
            
            serializer                  = AddressSerializer(address_obj)

        # if no previous billinng address object exists, create new object
        else:
            address_obj = Address.objects.create(
                                        address_type=address_type,
                                        address_1=address_1,
                                        city=city,
                                        province_or_state=province_or_state,
                                        country=country,
                                        postal_or_zip_code=postal_or_zip_code
                                        )

            request.session['address_id'] = address_obj.id
        
            # retrieve existing billing profile object, if not create new object
            billing_profile, billing_profile_created = BillingProfile.objects.new_or_get(request) 

            if billing_profile is not None:

                address_obj.billing_profile = billing_profile
                address_obj.save()
                
                request.session[address_type + "_address_id"] = address_obj.id

            else:
                print("Error - your address did not get saved")
               
            serializer                  = AddressSerializer(address_obj)
            
            
        return Response(serializer.data)

