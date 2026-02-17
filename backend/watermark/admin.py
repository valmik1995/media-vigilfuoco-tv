from django.contrib.gis import admin
from .models import Photo

@admin.register(Photo)
class PhotoAdmin(admin.GISModelAdmin): # GISModelAdmin attiva la mappa PostGIS
    list_display = ('id', 'titolo_display', 'data_caricamento', 'has_watermark')
    
    def titolo_display(self, obj):
        return obj.file.name.split('/')[-1]
    
    def has_watermark(self, obj):
        return bool(obj.watermarked_file)
    has_watermark.boolean = True