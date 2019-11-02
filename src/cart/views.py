from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import generics, permissions, pagination, status
from django.contrib.sessions.models import Session
from django.db.models import Q
from django.shortcuts import get_object_or_404, HttpResponseRedirect, redirect

from .models import Cart
from paintings.models import Painting
from .permissions import IsOwnerOrReadOnly
from .serializers import CartSerializer, MyPaintingSerializer
from paintings.serializers import PaintingSerializer

from rest_framework.request import Request
from rest_framework.test import APIRequestFactory


class CartListAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    This is the View for a specific cart
    """

    #this is the queryset of all carts as a list of objects (not really needed)
    queryset            = Cart.objects.all()
    serializer_class    = CartSerializer
    lookup_field        = 'id'   
    permission_classes  = [permissions.AllowAny]

    
    def get(self, request, id=None, slug=None, *args, **kwargs):

        cart_obj, new_obj       = Cart.objects.new_or_get(request)        
        serializer              = CartSerializer(cart_obj)
        cart_items = cart_obj.products.all()
        print(cart_items)
        """
        doing cart_obj.products wont't return anything because it returns a manager class which you cannot iterate
        https://stackoverflow.com/questions/52428124/django-manytomany-field-returns-none-but-it-has-related-records
        
        cart_items is a list of paintings as objects, not needed here but just want to show how I got it
        """

        return Response(serializer.data)

class CartUpdateAPIView(APIView):
    """
    This is the View for a specific item in a specific cart
    We're mainly using the post method here, the get is not really used but just for show
    """
    permission_classes  = [permissions.AllowAny]

    def get(self, request, pk=None, *args, **kwargs):

        product_id = request.get('product_id')

        product_obj = Painting.objects.get(pk=product_id)
        cart_obj, new_obj= Cart.objects.new_or_get(request)
        #remove from cart if already in cart
        if product_obj in cart_obj.products.all():
            cart_obj.products.remove(product_obj)
        #add to cart if not in cart already
        else:
            cart_obj.products.add(product_obj) #adding to many-to-many
        
        return redirect("cart-api:cart-list")

    def post(self, request, pk=None, *args, **kwargs):

        print(request)
        product_id = request.data['products'][0]

        """
        I have to get product_id using request.data instead of request.POST 
        because this is not the same as POSTing a HTML form, so it won't end up in the request.POST
        *Note remember to use dir(request) to see all methods of request
        """
        #to make sure that product_id is actually coming through
        if product_id is not None:
            
            try:
                #getting an instance of the painting from the Painting model
                product_obj = Painting.objects.get(id=product_id)
            except Painting.DoesNotExist:
                print("Sorry this product is out of stock.")
            
            cart_obj, new_obj = Cart.objects.new_or_get(request)
            
            #remove from cart if already in cart
            if product_obj in cart_obj.products.all():
                cart_obj.products.remove(product_obj)
                
            #add to cart if not in cart already
            else:
                cart_obj.products.add(product_obj) #adding to many-to-many
            
            print(cart_obj)
            print(product_id)
            print(product_obj)
            print(product_obj.price)
            print(product_obj.style)
            print(product_obj.artist)

            #getting the total number of items in cart. need this to show the number of items in cart in the nav bar
            request.session['cart_items'] = cart_obj.products.count() 

        return redirect("cart-api:cart-list")
    
# https://stackoverflow.com/questions/54969566/generics-listcreateapiview-django-rest-framework

"""
Stuff about sessions:

How to display all session variables in django?
https://stackoverflow.com/questions/46327583/how-to-display-all-session-variables-in-django

Django: Anonymous session & “temporary” one-to-one related model?
https://stackoverflow.com/questions/29113548/django-anonymous-session-temporary-one-to-one-related-model


complicated read.. may be helpful idk
https://stackoverflow.com/questions/5130639/django-setting-a-session-and-getting-session-key-in-same-view
"""