from rest_framework.request import Request
from rest_framework.test import APIRequestFactory
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import generics, permissions, pagination, status

from django.contrib.sessions.models import Session
from django.db.models import Q
from django.shortcuts import get_object_or_404, HttpResponseRedirect, redirect

from .models import Cart
from paintings.models import Painting
from orders.models import Order
from billing.models import BillingProfile
from accounts.models import GuestEmail
from addresses.models import Address

from .permissions import IsOwnerOrReadOnly
from .serializers import CartSerializer
from orders.serializers import OrderSerializer
from addresses.serializers import AddressSerializer
from accounts.serializers import GuestEmailSerializer
from billing.serializers import BillingProfileSerializer
from paintings.serializers import PaintingSerializer

import stripe
import environ


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
        # del request.session['cart_id']
        # del request.session["address_id"]            
        # del request.session["shipping_address_id"]
        # del request.session["billing_address_id"]
        # del request.session["account_id"]
        # del request.session["billing_profile_id"]
        # request.session['cart_items'] = 0

        # print(request.session.items())
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
        product_id = request.data['currentPaintingId'][0]

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

        # del request.session["cart_id"]
        # del request.session["address_id"]
        # del request.session["shipping_address_id"]
        # del request.session["billing_address_id"]

        billing_address_id      = request.session.get("billing_address_id", None)
        shipping_address_id     = request.session.get("shipping_address_id", None)
        account_id              = request.session.get("account_id", None)
        cart_id                 = request.session.get("cart_id", None)

        cart_obj, cart_created = Cart.objects.new_or_get(request)
        order_obj = None
        if cart_created or cart_obj.products.count() == 0:
            return redirect("cart-api:cart-list")     

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
            if billing_address_id:
                order_obj.billing_address = Address.objects.get(id=billing_address_id)
            if billing_address_id or shipping_address_id:
                order_obj.save()

        # order_data is a dictionary containing all the fields from specified in OrderSerializer
        serializer              = OrderSerializer(order_obj)
        order_data              = serializer.data    

        # appending to the order object with the associated FK objects in the same session so we can
        # show all the info from order, cart, email, shipping address, billing address in one summary page
        if account_id:
            account_id_obj                              = GuestEmail.objects.get(id=account_id)
            order_data['email']                         = account_id_obj.email

        if shipping_address_id:
            shipping_address_obj                        = Address.objects.get(id=shipping_address_id)
            order_data['shipping_first_name']           = shipping_address_obj.first_name
            order_data['shipping_last_name']            = shipping_address_obj.last_name
            order_data['shipping_address_1']            = shipping_address_obj.address_1
            order_data['shipping_city']                 = shipping_address_obj.city 
            order_data['shipping_province_or_state']    = shipping_address_obj.province_or_state
            order_data['shipping_country']              = shipping_address_obj.country
            order_data['shipping_postal_or_zip_code']   = shipping_address_obj.postal_or_zip_code
            order_data['shipping_phone']                = shipping_address_obj.phone

            
        if billing_address_id:
            billing_address_obj                         = Address.objects.get(id=billing_address_id)
            order_data['billing_first_name']            = billing_address_obj.first_name
            order_data['billing_last_name']             = billing_address_obj.last_name
            order_data['billing_address_1']             = billing_address_obj.address_1
            order_data['billing_city']                  = billing_address_obj.city 
            order_data['billing_province_or_state']     = billing_address_obj.province_or_state
            order_data['billing_country']               = billing_address_obj.country
            order_data['billing_postal_or_zip_code']    = billing_address_obj.postal_or_zip_code
            order_data['billing_phone']                 = billing_address_obj.phone

        if cart_id:
            cart_obj                                    = Cart.objects.get(id=cart_id)
            
            #painting is an m2m relationship in cart
            painting_objects_in_cart                    = cart_obj.products.all()

            #getting the painting title & price and passing it as a list of directionaries to be added to this order summary object
            painting_info = []
            for painting_obj in painting_objects_in_cart.iterator():
                painting_title = painting_obj.title
                painting_price = painting_obj.price
                painting_data  = {"painting_title": painting_title, "painting_price": painting_price}
                painting_info.append(painting_data)

            order_data['painting_info']                 = painting_info

        return Response(order_data)

    def post(self, request, pk=None, *args, **kwargs):

        # START OF STRIPE PAYMENT CODE

        env = environ.Env(
            # set casting, default value
            DEBUG=(bool, False)
        )
        # reading .env file
        environ.Env.read_env()

        STRIPE_SECRET_KEY = env('STRIPE_SECRET_KEY')
        stripe.api_key = STRIPE_SECRET_KEY
        # "sk_test_hqZxQTYC5Gif7ClgQ8EOAms700n2uPMW2s"
        
        # print(request.data)
        print(request.data)
        print(request.data['data'])

        #getting the main data to be send over the stripe
        token           = request.data['token']['id']
        total           = int(float(request.data['data']['total']))        
        email           = str(request.data['data']['email'])
        order_id        = str(request.data['data']['order_id'])
        painting_info   = request.data['data']['painting_info'] #this comes in as a list of list of directionaries (look above at get request to see how it was created)

        #getting the metadata to be sent over to stripe 
        shipping_first_name         = request.data['data']['shipping_first_name']
        shipping_last_name          = request.data['data']['shipping_last_name']
        shipping_address_1          = request.data['data']['shipping_address_1']
        shipping_city               = request.data['data']['shipping_city']
        shipping_province_or_state  = request.data['data']['shipping_province_or_state']
        shipping_country            = request.data['data']['shipping_country'] 
        shipping_postal_or_zip_code = request.data['data']['shipping_postal_or_zip_code']
        shipping_phone              = request.data['data']['shipping_phone']
        billing_first_name          = request.data['data']['billing_first_name'] 
        billing_last_name           = request.data['data']['billing_last_name'] 
        billing_address_1           = request.data['data']['billing_address_1'] 
        billing_city                = request.data['data']['billing_city'] 
        billing_province_or_state   = request.data['data']['billing_province_or_state'] 
        billing_country             = request.data['data']['billing_country'] 
        billing_postal_or_zip_code  = request.data['data']['billing_postal_or_zip_code'] 
        billing_phone               = request.data['data']['billing_phone'] 

        #looping over the purchased paintings and formatting appropriately to to be send over in the description
        ordered_paintings = []
        for i in painting_info:
            painting_title      = i["painting_title"]
            painting_price      = i["painting_price"]
            my_painting_info    = str(painting_title) + ": " + "C$"+str(painting_price)
            ordered_paintings.append(my_painting_info)
        my_ordered_paintings = "\n".join(ordered_paintings)

        # we have to multiple the amount by 100 because stripe default amounts are in cents 
        charge = stripe.Charge.create(
            amount          = total * 100,
            currency        = 'cad',
            description     = 'Order ID: '+order_id+"\n\n"+"PAINTINGS PURCHASED"+"\n"+my_ordered_paintings,
            source          = token,
            receipt_email   = email,
            idempotency_key = order_id, #an extra layer of security to make sure we don't double charge
            metadata        = {
                                'email': email,
                                'shipping_first_name': shipping_first_name,
                                'shipping_last_name': shipping_last_name,
                                'shipping_address_1': shipping_address_1,
                                'shipping_city': shipping_city,
                                'shipping_province_or_state': shipping_province_or_state,
                                'shipping_country': shipping_country,
                                'shipping_postal_or_zip_code': shipping_postal_or_zip_code,
                                'shipping_phone': shipping_phone,
                                'billing_first_name': billing_first_name,
                                'billing_last_name': billing_last_name,
                                'billing_address_1': billing_address_1,
                                'billing_city': billing_address_1,
                                'billing_province_or_state': billing_province_or_state,
                                'billing_country': billing_country,
                                'billing_postal_or_zip_code': billing_postal_or_zip_code,
                                'billing_phone': billing_phone
                                }
        )
        #stripe docs on email receipts: https://stripe.com/docs/receipts
        #stripe docs on idempotent key: https://stripe.com/docs/api/idempotent_requests
        # END OF STRIPE PAYMENT CODE

        address_id              = request.session.get("address_id", None)
        billing_address_id      = request.session.get("billing_address_id", None)
        shipping_address_id     = request.session.get("shipping_address_id", None)
        cart_id                 = request.session.get("cart_id", None)


        cart_obj, cart_created = Cart.objects.new_or_get(request)
        order_obj = None
        if cart_created or cart_obj.products.count() == 0:
            return redirect("cart-api:cart-list")   

        #getting and saving the billing and shipping address if they exist
        billing_profile, billing_profile_created = BillingProfile.objects.new_or_get(request)
        address_qs = None

        if billing_profile is not None:
            if request.user.is_authenticated:
                address_qs = Address.objects.filter(billing_profile=billing_profile)
            order_obj, order_obj_created = Order.objects.new_or_get(billing_profile, cart_obj)

            serializer              = OrderSerializer(order_obj)

        # START OF CODE FOR HANDLING CHANGES WHEN ORDER IS DONE
        is_done = order_obj.check_done()
        if is_done:
            order_obj.mark_paid()

            #getting all painting objects in cart and making it unavailable in the painting model
            if cart_id:
                cart_obj                                    = Cart.objects.get(id=cart_id)
                painting_objects_in_cart                    = cart_obj.products.all()

                for painting_obj in painting_objects_in_cart.iterator():
                    painting_obj.mark_unavailable()

            #deleting sessions/ adjusting all cart & checkout related sessions
            # no need to delete the account id & billing_profile_id, might as will keep their email for next time
            request.session['cart_items'] = 0
            del request.session['cart_id']
            del request.session["address_id"]            
            del request.session["shipping_address_id"]
            del request.session["billing_address_id"]
        
        # END OF CODE FOR HANDLING CHANGES WHEN ORDER IS DONE
        
        return Response(serializer.data)

