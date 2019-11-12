from django.conf import settings
from django.db import models
from django.db.models.signals import pre_save, post_save, m2m_changed
from billing.models import BillingProfile


User = settings.AUTH_USER_MODEL

ADDRESS_TYPE = (
    ('billing', 'Billing'),
    ('shipping', 'Shipping'),
)


COUNTRY_CHOICES = (
    ('canada', 'Canada'),
    ('united_states', 'United States'),
)

class AddressManager(models.Manager):

    def new_or_get(self, request):
    #getting existing object if it exists, create new object if none exists

        current_user = request.user

        #this is the getter
        address_id = request.session.get("address_id", None) #get the current id or None

        qs = self.get_queryset().filter(id=address_id)
   
        #querying the id to make sure that it actually exist
        if qs.count() == 1:
            new_obj = False
            address_obj = qs.first()
            
            #associate address to user if the user creates a address then logs in after
            if request.user.is_authenticated and address_obj.user is None:
                address_obj.user = request.user
                address_obj.save()

        #if the id doesn't exist then we'll create a brand new one and start that new session
        else:
            address_obj = Address.objects.new_address(user=request.user)
            new_obj = True
            #this is the setter | we're associating the new address's id with the session
            request.session['address_id'] = address_obj.id 

        return address_obj, new_obj

    def new_address(self, user=None):
        user_obj = None
        if user is not None:
            if user.is_authenticated:
                user_obj = user
        return self.model.objects.create(user=user_obj)

class Address(models.Model):
    
    user                         = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    billing_profile              = models.ForeignKey(BillingProfile, null=True, blank=True, on_delete=models.CASCADE)
    address_type                 = models.CharField(max_length=120, null=True, blank=True)
    address_1                    = models.CharField(max_length=120, null=True, blank=True)
    address_2                    = models.CharField(max_length=120, null=True, blank=True)
    city                         = models.CharField(max_length=120, null=True, blank=True)
    province_or_state            = models.CharField(max_length=120, null=True, blank=True)
    country                      = models.CharField(max_length=120, choices=COUNTRY_CHOICES, null=True, blank=True)
    postal_or_zip_code           = models.CharField(max_length=120, null=True, blank=True)

    objects = AddressManager()

    def __str__(self):
        return str(self.billing_profile)

    def get_address(self):
        return "{line1}, {line2}{city}, {province_or_state}, {country}, {postal_or_zip_code}".format(
            line1                       = self.address_1,
            line2                       = self.address_2 or "",
            city                        = self.city,
            province_or_state           = self.province_or_state,
            country                     = self.country,
            postal_or_zip_code          = self.postal_or_zip_code
        )

