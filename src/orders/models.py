from django.db import models
from django.db .models.signals import pre_save, post_save

from cart.models import Cart
from billing.models import BillingProfile
from addresses.models import Address

from .utils import unique_order_id_generator
from decimal import Decimal
import math

#The tuples represent, the database stored values is the 1st value, the 2nd value is the display value
#This to create the dropdown

ORDER_STATUS_CHOICES = (
    ('created', 'Created'),
    ('paid', 'Paid'),
    ('shipped', 'Shipped'),
    ('refunded', 'Refunded'), 
)

class OrderManager(models.Manager):
    
    def new_or_get(self, billing_profile, cart_obj):
            #we want to firstly see if the billing profile is equal to our current billing profile, and also if the cart is equal to our cart object 
            created = False
            qs = self.get_queryset().filter(billing_profile=billing_profile, cart=cart_obj, active=True, status='created')
            #if the above exist, then it will be our order object
            if qs.count() == 1:
                obj = qs.first()
            #otherwise we'll create a brand new object
            else:
                obj = self.model.objects.create(billing_profile=billing_profile, cart=cart_obj) #creating new object
                created = True
            return obj, created


class Order(models.Model):

    billing_profile     = models.ForeignKey(BillingProfile, null=True, blank=True, on_delete=models.CASCADE)
    order_id            = models.CharField(max_length=120, blank=True) #we want this to get an order ID with letters and numbers AB21DE3
    shipping_address    = models.ForeignKey(Address, related_name="shipping_address", null=True, blank=True, on_delete=models.CASCADE) #related_name is needed because we're using the same model twice so django needs a unique related_name to be able to differentiate them
    billing_address     = models.ForeignKey(Address, related_name="billing_address", null=True, blank=True, on_delete=models.CASCADE)
    cart                = models.ForeignKey(Cart, on_delete=models.CASCADE)
    status              = models.CharField(max_length=120, default='created', choices=ORDER_STATUS_CHOICES)
    shipping_total      = models.DecimalField(default=0.00, max_digits=100, decimal_places=2)
    total               = models.DecimalField(default=0.00, max_digits=100, decimal_places=2)
    active              = models.BooleanField(default=True)
 
    def __str__(self):
        return self.order_id

    objects = OrderManager()

    def update_total(self):
        cart_total = self.cart.total
        shipping_total = self.shipping_total
        new_total = math.fsum([cart_total, shipping_total]) #this approach of summing returns a float when adding two decimals
        formatted_total = format(new_total, '.2f') #".2f" is for 2 decimal places
        self.total = formatted_total
        self.save()
        return new_total

    def check_done(self):
        billing_profile = self.billing_profile
        shipping_address = self.shipping_address
        billing_address = self.billing_address
        total = self.total
        if billing_profile and shipping_address and billing_address and total > 0:
            return True
        return False

    def mark_paid(self):
        if self.check_done():
            self.status = "paid"
            self.save()
        return self.status


#creating a brand new random order ID if ID does not already exist
#signals.connect documentation here: https://docs.djangoproject.com/en/2.2/topics/signals/
def pre_save_create_order_id(sender, instance, *arg,**kwargs):
    if not instance.order_id:
        instance.order_id = unique_order_id_generator(instance)
    qs = Order.objects.filter(cart=instance.cart).exclude(billing_profile=instance.billing_profile) #
    #this is for if we added an order if as a guest then logs in afterwards. Since a new order id is generated (see new_or_get in OrderManager above), 
    #we will deactive the old order id by making active=False
    if qs.exists():
        qs.update(active=False)

pre_save.connect(pre_save_create_order_id, sender=Order)

#updating order total everytime the cart changes
def post_save_cart_total(sender, instance, created, *args, **kwargs):
    if not created:
        cart_obj = instance
        cart_total = cart_obj.total
        cart_id = cart_obj.id
        qs = Order.objects.filter(cart__id=cart_id) #the two underscores __ means in this cart object, look up by the id and get the cart id
        if qs.count() == 1:
            order_obj = qs.first()
            order_obj.update_total()

post_save.connect(post_save_cart_total, sender=Cart)

#updating total everything new order is created
def post_save_order_total(sender, instance, created, *args, **kwargs):
    print("running")
    if created:
        print("updating for the first time")
        instance.update_total()

post_save.connect(post_save_order_total, sender=Order)
     