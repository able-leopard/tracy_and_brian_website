from django.conf import settings
from django.db import models
from django.db.models.signals import pre_save, post_save, m2m_changed

User = settings.AUTH_USER_MODEL

# Create your models here.

class GuestEmailManager(models.Manager):

    def new_or_get(self, request):
    #getting existing object if it exists, create new object if none exists

        current_user = request.user

        #this is the getter
        account_id = request.session.get("account_id", None) #get the current id or None
        qs = self.get_queryset().filter(id=account_id)
        
        #querying the id to make sure that it actually exist
        if qs.count() == 1:
            new_obj = False
            account_obj = qs.first()
            
            #associate account to user if the user creates a account then logs in after
            if request.user.is_authenticated and account_obj.user is None:
                account_obj.user = request.user
                account_obj.save()

        #if the id doesn't exist then we'll create a brand new one and start that new session
        else:
            account_obj = GuestEmail.objects.new_account(user=request.user)
            new_obj = True
            #this is the setter | we're associating the new account's id with the session
            request.session['account_id'] = account_obj.id 

        return account_obj, new_obj

    def new_account(self, user=None):
        user_obj = None
        if user is not None:
            if user.is_authenticated:
                user_obj = user
        return self.model.objects.create(user=user_obj)

class GuestEmail(models.Model):
    user                = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    email               = models.EmailField()
    active              = models.BooleanField(default=True)
    update              = models.DateTimeField(auto_now=True)
    timestamp           = models.DateTimeField(auto_now_add=True)

    objects = GuestEmailManager()

    def __str__(self):
        return self.email
    
    class Meta:
        ordering = ["id"]
