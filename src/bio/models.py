from django.conf import settings
from django.db import models

class BioPhoto(models.Model):
    photo_name                  = models.CharField(blank=False, null=False, default="", max_length=255)
    src                         = models.ImageField(upload_to='uploaded_paintings', default='default.jpg')
    user                        = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)

    class Meta:
        ordering = ["src"]

    #when inputting photos, name the main photo begin with src

    def __str__(self):
        return str(self.photo_name)