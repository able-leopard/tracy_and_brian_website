from django.contrib.auth import get_user_model, authenticate, login, logout
from rest_framework import serializers

from .models import BioPhoto

class BioPhotoSerializer(serializers.ModelSerializer):
    
    # photo_title_url         = serializers.HyperlinkedIdentityField(
    #                             view_name='paintings-api:photos-title-list',
    #                             read_only=True,
    #                             lookup_field='title_id'
    #                             )
    # photo_specific_url      = serializers.HyperlinkedIdentityField(
    #                                 view_name='paintings-api:photos-specific-detail',
    #                                 read_only=True,
    #                                 lookup_field='id'
    #                                 )
    owner                   = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = BioPhoto
        
        fields =[
            'src',
            'photo_name',
            # 'photo_title_url',
            # 'photo_specific_url',
            'owner',
        ]

    def get_owner(self, obj):

        request = self.context['request']
        if request.user.is_authenticated:
            if obj.user == request.user:
                return True
        return False