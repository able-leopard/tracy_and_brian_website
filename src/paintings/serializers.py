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
    
    title_name              = serializers.CharField(source='title', read_only=True)
    photo_title_url         = serializers.HyperlinkedIdentityField(
                                view_name='paintings-api:photos-title-list',
                                read_only=True,
                                lookup_field='title_id'
                                )
    photo_specific_url      = serializers.HyperlinkedIdentityField(
                                    view_name='paintings-api:photos-specific-detail',
                                    read_only=True,
                                    lookup_field='id'
                                    )
    owner                   = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PaintingPhoto
        
        fields =[
            'title',
            'src',
            'title_name',
            'photo_title_url',
            'photo_specific_url',
            'owner',
        ]

    def get_owner(self, obj):

        request = self.context['request']
        if request.user.is_authenticated:
            if obj.user == request.user:
                return True
        return False

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
            'id',
            'url',
            'user',
            'title',                    
            'style',                        
            'description',
            'medium',               
            'size_measurements',
            'size_class',
            'artist',
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

