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

    
    def get(self, request, pk=None, *args, **kwargs):

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


{
    'products': [8],
    'sub_total': 0, 
    'shipping': 0, 
    'total': 0, 
    'currentCart': [{'id': 13, 'title': 'Romantic Walk', 'price': '50000.00', 'size_measurements': '10 W x 25 L x 30 H', 'srcs': [{'src': '/media_cdn/uploaded_paintings/1Romantic_Walk_iRAfY9T.jpg'}], 'slug': 'romantic-walk'}, 
                    {'id': 9, 'title': 'White Rhino', 'price': '800.00', 'size_measurements': '11Wx12Hx12L', 'srcs': [{'src': '/media_cdn/uploaded_paintings/1White-Rhino_3BB8A2A.jpg'}], 'slug': 'white-rhino'}, 
                    {'id': 7, 'title': 'Free Giraffe', 'price': '500.00', 'size_measurements': '10 W x 25 L x 30 H', 'srcs': [{'src': '/media_cdn/uploaded_paintings/1giraffe_9U2h8Nt.jpg'}, {'src': '/media_cdn/uploaded_paintings/giraffe2.jpeg'}, {'src': '/media_cdn/uploaded_paintings/giraffe3.jpeg'}], 'slug': 'free-giraffe'}, 
                    {'id': 4, 'title': 'Leopard in Africa', 'price': '500.00', 'size_measurements': '10 W x 25 L x 30 H', 'srcs': [{'src': '/media_cdn/uploaded_paintings/1leopard_u5pVVhF.jpg'}], 'slug': 'leopard-in-africa'}]
}

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
  
            # print(product_obj.price)
            # print(product_obj.style)
            # print(product_obj.artist)

            #getting the total number of items in cart. need this to show the number of items in cart in the nav bar
            request.session['cart_items'] = cart_obj.products.count() 
            # print(request.session['cart_items'])

        return redirect("cart-api:cart-list")

class CheckoutHomeView(APIView):

    def get(self, request, pk=None, *args, **kwargs):

        context = {}
        cart_obj, cart_created = Cart.objects.new_or_get(request)
        order_obj = None
        if cart_created or cart_obj.products.count() == 0:
            return redirect("cart:cart-list")  
        
        guest_form = GuestForm()
        address_form = AddressForm()

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

        context["object"] = order_obj
        context["billing_profile"] = billing_profile
        context["login_form"] = login_form
        context["guest_form"] = guest_form
        context["address_form"] = address_form
        context["address_qs"] = address_qs


        return redirect("cart-api:checkout-home")

    def post(self, request, pk=None, *args, **kwargs):

        context = {}
        cart_obj, cart_created = Cart.objects.new_or_get(request)
        order_obj = None
        if cart_created or cart_obj.products.count() == 0:
            return redirect("cart:cart-list")  
        
        guest_form = GuestForm()
        address_form = AddressForm()

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
            return redirect("success/")
        #POST specific code end

        context["object"] = order_obj
        context["billing_profile"] = billing_profile
        context["login_form"] = login_form
        context["guest_form"] = guest_form
        context["address_form"] = address_form
        context["address_qs"] = address_qs

        return redirect("cart-api:checkout-home")
