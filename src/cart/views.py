from rest_framework.request import Request
from rest_framework.test import APIRequestFactory
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import generics, permissions, pagination, status

from django.contrib.sessions.models import Session
from django.db.models import Q
from django.shortcuts import get_object_or_404, HttpResponseRedirect, redirect

from paintings.models import Painting
from orders.models import Order
from billing.models import BillingProfile
from accounts.models import GuestEmail
from addresses.models import Address

from .models import Cart
from .permissions import IsOwnerOrReadOnly
from .serializers import CartSerializer
from orders.serializers import OrderSerializer
from addresses.serializers import AddressSerializer
from accounts.serializers import GuestEmailSerializer
from billing.serializers import BillingProfileSerializer
from paintings.serializers import PaintingSerializer

class CartListAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    This is the View for a specific cart
    """

    #this is the queryset of all carts as a list of objects (not really needed)
    queryset            = Cart.objects.all()
    serializer_class    = CartSerializer
    lookup_field        = 'id'   
    permission_classes  = [permissions.AllowAny]

    def get(self, request, pk=None, *args, **kwargs):

        cart_obj, new_obj       = Cart.objects.new_or_get(request)        
        serializer              = CartSerializer(cart_obj)
        cart_items              = cart_obj.products.all()

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

        # print(dir(request))
        print(request.data)
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
  

            #getting the total number of items in cart. need this to show the number of items in cart in the nav bar
            request.session['cart_items'] = cart_obj.products.count() 

        return redirect("cart-api:cart-list")

class CheckoutHomeAPIView(APIView):

    permission_classes  = [permissions.AllowAny]


    def get(self, request, pk=None, *args, **kwargs):

        del request.session["address_id"]
        # del request.session["shipping_address_id"]
        # del request.session["billing_address_id"]

        #address session is not matching, session as 1 smaller than actual id

        cart_obj, cart_created = Cart.objects.new_or_get(request)
        order_obj = None
        if cart_created or cart_obj.products.count() == 0:
            return redirect("cart-api:cart-list")     

        billing_address_id = request.session.get("billing_address_id", None)

        shipping_address_id = request.session.get("shipping_address_id", None)

        #getting and saving the billing and shipping address if they exist
        billing_profile, billing_profile_created = BillingProfile.objects.new_or_get(request)
        address_qs = None

        #getting the related foreign keys objects and appending to the order object 
        # (billing_profile, cart, shipping_address, billing_address)
        if billing_profile is not None:
            if request.user.is_authenticated:
                address_qs = Address.objects.filter(billing_profile=billing_profile)
            order_obj, order_obj_created = Order.objects.new_or_get(billing_profile, cart_obj)
            if shipping_address_id:
                order_obj.shipping_address = Address.objects.get(id=shipping_address_id)
                # del request.session["shipping_address_id"]
            if billing_address_id:
                order_obj.billing_address = Address.objects.get(id=billing_address_id)
                # del request.session["billing_address_id"]
            if billing_address_id or shipping_address_id:
                order_obj.save()

        serializer              = OrderSerializer(order_obj)

        # this is a dictionary containing all the fields from specified in OrderSerializer
        order_data              = serializer.data    

        if shipping_address_id:
            shipping_address_obj = Address.objects.get(id=shipping_address_id)
            order_data['shipping_address_1']            = shipping_address_obj.address_1
            order_data['shipping_city']                 = shipping_address_obj.city 
            order_data['shipping_province_or_state']    = shipping_address_obj.province_or_state
            order_data['shipping_country']              = shipping_address_obj.country
            order_data['postal_or_zip_code']            = shipping_address_obj.postal_or_zip_code

            # don't delete the sessions here. only delete at the post after everything is done
            del request.session["shipping_address_id"]
            del request.session["billing_address_id"]

        return Response(order_data)

    def post(self, request, pk=None, *args, **kwargs):

        cart_obj, cart_created = Cart.objects.new_or_get(request)
        order_obj = None
        if cart_created or cart_obj.products.count() == 0:
            return redirect("cart:cart-list")  

        billing_address_id = request.session.get("billing_address_id", None)
        shipping_address_id = request.session.get("shipping_address_id", None)

        #getting and saving the billing and shipping address if they exist
        billing_profile, billing_profile_created = BillingProfile.objects.new_or_get(request)
        address_qs = None

        if billing_profile is not None:
            if request.user.is_authenticated:        
                address_qs = Address.objects.filter(billing_profile=billing_profile)
            order_obj, order_obj_created = Order.objects.new_or_get(billing_profile, cart_obj)
            if shipping_address_id:
                order_obj.shipping_address = Address.objects.get(id=shipping_address_id)
                del request.session["shipping_address_id"]
            if billing_address_id:
                order_obj.billing_address = Address.objects.get(id=billing_address_id)
                del request.session["billing_address_id"]
            if billing_address_id or shipping_address_id:
                order_obj.save()
        
        #POST specific code begin
        is_done = order_obj.check_done()
        if is_done:
            order_obj.mark_paid()
            request.session['cart_items'] = 0
            del request.session['cart_id']

        #POST specific code end

        # make a get request after filling in the addresses
        
        # only make a post request once its been paid off
        serializer              = OrderSerializer(order_obj)
        
        return Response(serializer.data)

class CheckoutSummaryAPIView(APIView):

    permission_classes  = [permissions.AllowAny]


    def get(self, request, pk=None, *args, **kwargs):

        cart_obj, cart_created = Cart.objects.new_or_get(request)
        order_obj = None
        if cart_created or cart_obj.products.count() == 0:
            return redirect("cart-api:cart-list")

        billing_address_id = request.session.get("billing_address_id", None)

        shipping_address_id = request.session.get("shipping_address_id", None)

        #getting and saving the billing and shipping address if they exist
        billing_profile, billing_profile_created = BillingProfile.objects.new_or_get(request)
        address_qs = None

        if billing_profile is not None:
            if request.user.is_authenticated:
                address_qs = Address.objects.filter(billing_profile=billing_profile)
            order_obj, order_obj_created = Order.objects.new_or_get(billing_profile, cart_obj)
            if shipping_address_id:
                order_obj.shipping_address = Address.objects.get(id=shipping_address_id)
                del request.session["shipping_address_id"]
            if billing_address_id:
                order_obj.billing_address = Address.objects.get(id=billing_address_id)
                del request.session["billing_address_id"]
            if billing_address_id or shipping_address_id:
                order_obj.save()

        serializer              = OrderSerializer(order_obj)
        
        return Response(serializer.data)