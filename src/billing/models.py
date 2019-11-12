from django.db import models
from django.conf import settings
from django.db.models.signals import post_save, pre_save

from accounts.models import GuestEmail

import stripe
stripe.api_key = "sk_test_hqZxQTYC5Gif7ClgQ8EOAms700n2uPMW2s"

User = settings.AUTH_USER_MODEL

class BillingProfileManager(models.Manager):
        
    def new_or_get(self, request):
            
        user = request.user
        account_id = request.session.get('account_id')
        created = False

        #this is the getter line
        billing_id = request.session.get('billing_profile_id', None)
        qs = self.get_queryset().filter(id=billing_id)

        #querying the id to make sure that it actually exist
        if qs.count() == 1:
            billing_obj = qs.first()
        
            #if the user is authenticated this is the billing profile we're using
            if user.is_authenticated:
            #this is the logged in user checkoutl remembers payment stuff
                billing_obj, created = self.model.objects.get_or_create(user=user, email=user.email) #this get_or_create is going to get or create this billing profile based on the user and the email

        else:                                                        
            #if the user is not authenticated and they have the guest email id
            if account_id is not None:
                #this is the guest user checkout; auto reloads payment stuff
                account_obj = GuestEmail.objects.get(id=account_id)
                billing_obj, created = self.model.objects.get_or_create(email=account_obj.email)

                #this is the setter line
                request.session['billing_profile_id'] = billing_obj.id         
            else:
                pass
        return billing_obj, created

class BillingProfile(models.Model):
    user        = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE) #null & blank = True because we want to let guest users be able to login as well | unique=True means one user can only ahve one billing profile
    email       = models.EmailField()
    active      = models.BooleanField(default=True)
    update      = models.DateTimeField(auto_now=True)
    timestamp   = models.DateTimeField(auto_now_add=True)
    customer_id = models.CharField(max_length=120, null=True, blank=True)
    
    objects = BillingProfileManager()

    def __str__(self):
        return str(self.id)


def billing_profile_created_receiver(sender, instance, *args, **kwargs):
    if not instance.customer_id and instance.email:
        print("ACTUAL API REQUEST Send to stripe/ braintree")
        customer = stripe.Customer.create(
            email = instance.email
            )
        instance.customer_id = customer.id 
        print(customer)
                 
pre_save.connect(billing_profile_created_receiver, sender=BillingProfile)
#see stripe customer documentation here: https://stripe.com/docs/api/customers?lang=python


def user_created_receiver(sender, instance, created, *args, **kwargs):
    if created and instance.email:
        BillingProfile.objects.get_or_create(user=instance, email=instance.email) 

post_save.connect(user_created_receiver, sender=User)