from django.contrib import admin
from .models import Galleria, Categoria, Tag


@admin.register(Galleria)
class GalleriaAdmin(admin.ModelAdmin):
    # Rimosso 'created_at' dalla posizione [2]
    list_display = ('title', 'category', 'image_thumbnail_display')

    # Rimosso 'created_at' dai filtri
    list_filter = ('category', 'tags')

    search_fields = ('title', 'description')

    def image_thumbnail_display(self, obj):
        if obj.image_thumbnail:
            from django.utils.html import format_html
            return format_html('<img src="{}" style="width: 50px; height: auto;" />', obj.image_thumbnail.url)
        return "Nessuna immagine"

    image_thumbnail_display.short_description = "Anteprima"
