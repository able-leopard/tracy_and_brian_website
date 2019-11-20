from django.conf import settings
from django.db import models
from django.db.models.signals import pre_save
from .utils import unique_slug_generator
import requests

# NameField for always capitalizing the artist name when inputted
# https://stackoverflow.com/questions/36330677/django-model-set-default-charfield-in-lowercase

class NameField(models.CharField):
    def __init__(self, *args, **kwargs):
        super(NameField, self).__init__(*args, **kwargs)

    def get_prep_value(self, value):
        return str(value).capitalize()


class Painting(models.Model):

# can possibly use CHOICES for style, medium, and series

    SIZE_CLASS_CHOICES = (
        ('small', 'small'),
        ('medium', 'medium'),
        ('large', 'large')
    )

    STYLE_CHOICES = (
        ('abstract', 'abstract'),
        ('animal', 'animal'),
        ('landscape', 'landscape'),
        ('nature', 'nature'),
        ('people', 'people'),
        ('portrait', 'portrait'),
        ('other', 'other')
    )

    ARTIST_CHOICES = (
        ('Brian', 'Brian'),
        ('Tracy', 'Tracy'),
    )
    
    user                        = models.ForeignKey(settings.AUTH_USER_MODEL, default="", on_delete=models.CASCADE)
    title                       = models.CharField(blank=False, null=False, default="", max_length=255)
    slug                        = models.SlugField(blank=True, null=True)
    style                       = models.CharField(blank=True, null=True, default="", max_length=255, choices=STYLE_CHOICES)     
    description                 = models.TextField(blank=True, null=True, default="")
    size_measurements           = models.CharField(blank=True, null=True, default="", max_length=255) 
    size_class                  = models.CharField(blank=True, null=True, default="", max_length=255, choices=SIZE_CLASS_CHOICES) #this field might be invisible when display but will be used in filtering search later
    artist                      = models.CharField(blank=True, null=True, default="", max_length=255, choices=ARTIST_CHOICES)
    price                       = models.DecimalField(blank=True, null=True, decimal_places=2, max_digits=20)
    completed_year              = models.CharField(blank=True, null=True, default="", max_length=255)
    available                   = models.BooleanField(default=True)
    updated                     = models.DateTimeField(auto_now=True, auto_now_add=False)
    timestamp                   = models.DateTimeField(auto_now=False, auto_now_add=True)

    def __str__(self):
        return self.title

    #this gets callled after purchase is complete
    def mark_unavailable(self):
        self.available   = False
        self.save()
        return self.available

    class Meta:
        ordering = ["-timestamp", "-updated"]


def pre_save_painting_receiver(sender, instance, *args, **kwargs):
    if not instance.slug:
        instance.slug = unique_slug_generator(instance)

pre_save.connect(pre_save_painting_receiver, sender=Painting)


#adding the related_name argument is extremely important - here it matches the fields 'photos' in serializers.py
#https://stackoverflow.com/questions/54670087/serialize-data-from-multiple-models-django

class PaintingPhoto(models.Model):
    title                       = models.ForeignKey(Painting, default="", related_name='srcs', on_delete=models.CASCADE)
    src                         = models.ImageField(upload_to='uploaded_paintings', default='default.jpg')
    user                        = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)

    class Meta:
        ordering = ["src"]

    #when inputting photos, name the main photo begin with src

    def __str__(self):
        return str(self.title)

