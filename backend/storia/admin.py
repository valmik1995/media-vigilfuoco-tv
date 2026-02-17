from django.contrib.gis import admin
from .models import Storia


@admin.register(Storia)
class StoriaAdmin(admin.GISModelAdmin):  # Usa GISModelAdmin per la mappa
    list_display = ('titolo', 'data', 'comune')
    search_fields = ('titolo',)
    # Imposta la mappa di default (OpenStreetMap è la più comune)
    default_lon = 12.0
    default_lat = 42.0
    default_zoom = 6
