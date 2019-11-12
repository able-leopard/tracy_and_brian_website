from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import generics, permissions, pagination, status

from .models import BillingProfile
from .serializers import BillingProfileSerializer

import stripe

stripe.api_key = "sk_test_hqZxQTYC5Gif7ClgQ8EOAms700n2uPMW2s"
STRIPE_PUB_KEY = 'pk_test_CwlnViHKaxeXaEy0vW2O2PTL00LphAnP8w' #the publish key is what's going on the front end

def payment_method_view(request):
    if request.method == "POST":
        print(request.POST)
    return render(request, 'billing/payment_method.html', {"publish_key": STRIPE_PUB_KEY})


class BillingListAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    This is the View for a specific cart
    """

    #this is the queryset of all carts as a list of objects (not really needed)
    queryset            = BillingProfile.objects.all()
    serializer_class    = BillingProfileSerializer
    lookup_field        = 'id'   
    permission_classes  = [permissions.AllowAny]


    def get(self, request, pk=None, *args, **kwargs):

        billing_obj, new_obj        = BillingProfile.objects.new_or_get(request)      
        serializer                  = BillingProfileSerializer(billing_obj)

        print(billing_obj)
        # billing_items               = billing_obj.products.all()
        # print(billing_items)
        
        return Response(serializer.data)


class BillingUpdateAPIView(APIView):
    """
    This is the View for a specific item in a specific cart
    We're mainly using the post method here, the get is not really used but just for show
    """
    permission_classes  = [permissions.AllowAny]

    def get(self, request, pk=None, *args, **kwargs):

        """
        GET METHOD not needed
        """

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

        return redirect("cart-api:cart-list")