from django.contrib import admin
from .models import Video


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    # Colonne visualizzate nella lista dei video
    list_display = ('title', 'status', 'formato',
                    'posizione', 'created_date', 'id')

    # Filtri laterali per gestire grandi quantità di video
    list_filter = ('status', 'formato', 'posizione', 'created_date')

    # Campi di ricerca
    search_fields = ('title', 'id')

    # Campi in sola lettura (per evitare modifiche accidentali a ID e date)
    readonly_fields = ('id', 'created_date', 'error_log')

    # Organizzazione dei campi nel modulo di modifica
    fieldsets = (
        ('Informazioni Base', {
            'fields': ('id', 'title', 'created_date')
        }),
        ('Configurazione Video', {
            'fields': ('formato', 'posizione', 'codino', 'logo')
        }),
        ('File', {
            'fields': ('video', 'video_watermarks')
        }),
        ('Stato Elaborazione', {
            'fields': ('status', 'error_log'),
            'description': 'Monitoraggio del task Celery per il watermark.'
        }),
    )

    # Azione per resettare lo stato in caso di errore (opzionale)
    actions = ['reset_status']

    @admin.action(description="Resetta stato a Caricato")
    def reset_status(self, request, queryset):
        queryset.update(status='UPLOADED')
