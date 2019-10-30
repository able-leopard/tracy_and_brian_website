from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import generics, permissions, pagination, status
from django.contrib.sessions.models import Session
from django.db.models import Q
from django.shortcuts import get_object_or_404

from .models import Cart
from paintings.models import Painting
from .permissions import IsOwnerOrReadOnly
from .serializers import CartSerializer, MyPaintingSerializer
from paintings.serializers import PaintingSerializer

from rest_framework.request import Request
from rest_framework.test import APIRequestFactory

class CartListCreateAPIView(generics.ListCreateAPIView):
    """
    This is the View for every cart that exists in the website
    """

    queryset            = Cart.objects.all()
    print(queryset)

    serializer_class    = CartSerializer
    permission_classes  = [permissions.AllowAny]    
    # permissions.AllowAny allows POST for users that are not logged in
    # https://www.django-rest-framework.org/api-guide/permissions/#setting-the-permission-policy
        

    def perform_create(self, serializer):
        serializer.save()

    def get_queryset(self):
        # filter the queryset based on the filters applied
        queryList = Cart.objects.all()
        print(queryList)

        cart_id = self.request.session.get("cart_id", None)
        print(cart_id)

        my_session = Session.objects.all()

        # print(my_session)
        # print(len(my_session))
        # print(self.request.session.items())

        return queryList


class CartDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    This is the View for a specific cart
    """

    #this is the queryset of all carts as a list of objects (not really needed)
    queryset            = Cart.objects.all()
    serializer_class    = CartSerializer
    lookup_field        = 'id'   
    permission_classes  = [permissions.AllowAny]

    
    def get(self, request, id):

        factory = APIRequestFactory()
        request = factory.get('/')

        serializer_context = {
            'request': Request(request),
        }

        cart_obj                = get_object_or_404(Cart, id=id)
        
        serializer              = CartSerializer(instance=cart_obj, context=serializer_context)  
        
        """
        doing cart_obj.products wont't return anything because it returns a manager class which you cannot iterate
        https://stackoverflow.com/questions/52428124/django-manytomany-field-returns-none-but-it-has-related-records
        
        cart_items is a list of paintings as objects, not needed here but just want to show how I got it
        """
        cart_items = cart_obj.products.all()
        print(cart_items)

        return Response(serializer.data)

    def post(self, request, id):

        # https://www.django-rest-framework.org/tutorial/3-class-based-views/
        # https://stackoverflow.com/questions/29731013/django-rest-framework-cannot-call-is-valid-as-no-data-keyword-argument

        factory = APIRequestFactory()
        request = factory.get('/')

        serializer_context = {
            'request': Request(request),
        }

        cart_obj                = get_object_or_404(Cart, id=id)
        
        serializer              = CartSerializer(data=cart_obj, context=serializer_context) 

        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CartItemDetailAPIView(APIView):
    """
    This is the View for a specific item in a specific cart
    """
    def get(self, request, id, slug):

        # this is required for the hyperlinked field
        # https://stackoverflow.com/questions/34438290/assertionerror-hyperlinkedidentityfield-requires-the-request-in-the-serialize

        factory = APIRequestFactory()
        request = factory.get('/')

        serializer_context = {
            'request': Request(request),
        }

        #this is the current cart as an object
        cart_obj         = get_object_or_404(Cart, id=id)

        #this is the current item (the painting) as an object
        painting_obj     = get_object_or_404(Painting, slug=slug)

        serializer       = PaintingSerializer(instance=painting_obj, context=serializer_context)  
        
        return Response(serializer.data)


    """
    stackoverflow for how to delete an m2m relationship
    IMPORTANT to note we're not deleting the painting here but rather removing its m2m relationship with
    the Cart model
    https://stackoverflow.com/questions/6333068/django-removing-object-from-manytomany-relationship#
    """
    def delete(self, request, id, slug):
    
        factory = APIRequestFactory()
        request = factory.get('/')

        serializer_context = {
            'request': Request(request),
        }

        #this is the current cart as an object
        cart_obj                = get_object_or_404(Cart, id=id)
    
        #this is the current item as an object
        painting_obj            = get_object_or_404(Painting, slug=slug)
       
        cart_obj.products.remove(painting_obj)
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    
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