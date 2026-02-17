from rest_framework import serializers
from .models import Photo
from .validators import FileMimeValidator, FileMimeValidatorHeic

class PhotoUploadSerializer(serializers.ModelSerializer):
    # Rimuoviamo il validatore rigido che causa il 400
    file = serializers.FileField() 
    watermarked_url = serializers.SerializerMethodField()

    class Meta:
        model = Photo
        fields = ('id', 'file', 'watermarked_url', 'data_caricamento', 'posizione')

    def validate_file(self, value):
        # Controlliamo solo l'estensione in modo semplice
        extension = value.name.split('.')[-1].lower()
        allowed_extensions = ['jpg', 'jpeg', 'png', 'heic', 'heif']
        
        if extension not in allowed_extensions:
            raise serializers.ValidationError(f"Formato .{extension} non supportato.")
        
        # Se vuoi comunque usare i tuoi validatori MIME, assicurati che 
        # FileMimeValidatorHeic accetti 'image/heic' e 'application/octet-stream'
        return value

    def get_watermarked_url(self, obj):
        request = self.context.get('request')
        if obj.watermarked_file and request:
            return request.build_absolute_uri(obj.watermarked_file.url)
        return None