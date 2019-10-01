from django.contrib.auth import get_user_model, authenticate, login, logout
from django.db.models import Q
from django.urls import reverse
from django.utils import timezone

from rest_framework import serializers

from .models import Painting, PaintingPhoto
User = get_user_model()

class UserPublicSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False, allow_blank=True, read_only=True)
    class Meta:
        model = User
        fields = [
            'username',  
            'first_name',
            'last_name',
            ]
    

class PaintingPhotoSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = PaintingPhoto
        fields =[
            'src',
        ]

#becareful here, if anyone submits a POST with an empty title, it will result in the empty slug, (which will mess up the url lookup since the title is the slug in this case)
#make title a required field in the actual interface, also remember to don't submit s POST with an empty title from the Django restframework directly
class PaintingSerializer(serializers.ModelSerializer):
    url             = serializers.HyperlinkedIdentityField(
                            view_name='paintings-api:detail',
                            read_only=True,
                            lookup_field='slug'
                            )
    user            = UserPublicSerializer(read_only=True)
    owner           = serializers.SerializerMethodField(read_only=True)
    srcs            = PaintingPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Painting
        fields = [
            'url',
            'user',
            'title',                    
            'style', 
            'medium',                           
            'description',                
            'size_measurements',
            'size_class',
            'artist',
            'series',
            'price',
            'completed_year',                       
            'available',                                
            'updated',
            'timestamp',
            'owner',
            'slug',
            'srcs',
        ]

    def get_owner(self, obj):

        request = self.context['request']
        if request.user.is_authenticated:
            if obj.user == request.user:
                return True
        return False

"""
Not sure if the below is needed. Seems like the the Django REST nested documentation said to include this part:
https://www.django-rest-framework.org/api-guide/relations/#nested-relationships
"""
    # def create(self, validated_data):
    
    #     photo_set_data = validated_data.pop('photos')
    #     painting = Painting.objects.create(**validated_data)
    #     for photo in photo_set_data:
    #         PaintingPhoto.objects.create(painting=painting, **photo_set_data)
    #     return painting
