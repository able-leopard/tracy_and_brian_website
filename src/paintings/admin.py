from django.contrib import admin

# Register your models here.
from .models import Painting, PaintingPhoto

class PaintingModelAdmin(admin.ModelAdmin):
    list_display = ["title", "updated", "timestamp"]
    list_display_links = ["updated"]
    list_editable = ["title"]
    list_filter = ["updated", "timestamp"]

    search_fields = ["title", "description"]
    class Meta:
        model = Painting

class PaintingPhotoModelAdmin(admin.ModelAdmin):
    list_display = ["title", "src"]
    list_filter = ["title"]


    class Meta:
        model = PaintingPhoto


myModels = [Painting, PaintingPhoto]

admin.site.register(Painting, PaintingModelAdmin)
admin.site.register(PaintingPhoto, PaintingPhotoModelAdmin)
