from django.conf import settings
from django.db import models
from django.db.models.signals import pre_save, post_save, m2m_changed
from django.contrib.sessions.models import Session

from paintings.models import Painting
from paintings.utils import unique_slug_generator

# https://stackoverflow.com/questions/29113548/django-anonymous-session-temporary-one-to-one-related-model


class CartManager(models.Manager):

    def new_or_get(self, request):
    #getting existing object if it exists, create new object if none exists

        # current_user = request.user
        # print(current_user)

        cart_id = request.session.get("cart_id", None) #get the current id or None
        qs = self.get_queryset().filter(id=cart_id)
        print(qs)
        #querying the id to make sure that it actually exist
        if qs.count() == 1:
            new_obj = False
            cart_obj = qs.first()
            
            #associate cart to user if the user creates a cart then logs in after
            # if request.user.is_authenticated and cart_obj.user is None:
            #     cart_obj.user = request.user
            #     cart_obj.save()

        #if the id doesn't exist then we'll create a brand new one and start that new session
        else:
            cart_obj = Cart.objects.new_cart()
            new_obj = True
            request.session['cart_id'] = cart_obj.id #this is the setter

        return cart_obj, new_obj

    def new_cart(self, user=None):
        # print(user)
        user_obj = None
        if user is not None:
            if user.is_authenticated:
                user_obj = user
        return self.model.objects.create()


class Cart(models.Model):
    products                = models.ManyToManyField(Painting, related_name='carts', blank=True) #blank=True because we want the ability to have an empty cart
    sub_total               = models.DecimalField(default=0.00, max_digits=100, decimal_places=2) 
    shipping                = models.DecimalField(default=0.00, max_digits=100, decimal_places=2)     
    total                   = models.DecimalField(default=0.00, max_digits=100, decimal_places=2)
    updated                 = models.DateTimeField(auto_now=True) #to track when the cart was updated    
    timestamp               = models.DateTimeField(auto_now_add=True) #to track when the painting was added to the cart
    painting_title_slug     = models.SlugField(blank=True, null=True)


    objects = CartManager()
    
    def __str__(self):
        return str(self.id)

    class Meta:
        ordering = ["id"]
    

#whenever I hit save this is called
def m2m_changed_cart_receiver(sender, instance, action, *args, **kwargs):
    
        #see here for explaination of actions: https://docs.djangoproject.com/en/2.2/ref/signals/#m2m-changed
        if action == 'post_add' or action == 'post_remove' or action == 'post_clear': 
            
            #getting all the paintings
            products = instance.products.all()
            total = 0
            
            #adding each painting to get the total price
            for x in products:
                total += x.price
            if instance.sub_total != total:
                instance.sub_total = total
                instance.save()

                
#m2m_changed documentation: https://docs.djangoproject.com/en/2.2/ref/signals/#m2m-changed
m2m_changed.connect(m2m_changed_cart_receiver, sender=Cart.products.through) #we need the through method for the m2m

#django manytomany documentation:
#https://docs.djangoproject.com/en/2.2/topics/db/examples/many_to_many/

def pre_save_cart_receiver(sender, instance, *args, **kwargs):

    # if not instance.slug:
    #     instance.painting_title_slug = unique_slug_generator(instance.products)

    #only add the tax, shipping etc if sub_total is > 0. (replace +10 with actual tax/ shipping later)
    if instance.sub_total > 0:
        instance.total = float(instance.sub_total) * 1 #instead of +10, play around to get the taxes and shipping rates later
    else:
        instance.total = 0.00

pre_save.connect(pre_save_cart_receiver, sender=Cart)
