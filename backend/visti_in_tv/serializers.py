from rest_framework import serializers
from .models import VistoInTv

class VistoInTvSerializer(serializers.ModelSerializer):
    # Campi calcolati per avere l'URL completo ai media
    immagine_url = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()

    class Meta:
        model = VistoInTv
        fields = [
            'id', 'codice_cartella', 'title', 'slug', 
            'body', 'data', 'immagine_url', 'video_url'
        ]

    def get_immagine_url(self, obj):
        if obj.immagine:
            return self.context['request'].build_absolute_uri(obj.immagine.url)
        return None

    def get_video_url(self, obj):
        if obj.video:
            return self.context['request'].build_absolute_uri(obj.video.url)
        return None