from django.contrib import admin
from .models import VistoInTv

@admin.register(VistoInTv)
class VistiInTVAdmin(admin.ModelAdmin):
    # Colonne visibili nella lista principale
    list_display = ('title', 'data', 'prima_pagina','codice_cartella', 'get_etichette')
    
    # Filtri laterali per una ricerca rapida
    list_filter = ('prima_pagina', 'data', 'etichette')
    
    # Campi su cui è possibile effettuare ricerche testuali
    search_fields = ('title', 'body')
    
    # Generazione automatica dello slug mentre scrivi il title
    prepopulated_fields = {'slug': ('title',)}
    
    # Organizzazione dei campi nel modulo di modifica
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'data', 'prima_pagina')
        }),
        ('Contenuto', {
            'fields': ('body', 'etichette'),
        }),
        ('Media', {
            'classes': ('collapse',), # Rende la sezione collassabile
            'fields': ('immagine', 'didascalia', 'video'),
        }),
    )

    # Permette di gestire meglio le relazioni ManyToMany pesanti
    filter_horizontal = ('etichette',)

    # Metodo per visualizzare le etichette nella list_display
    def get_etichette(self, obj):
        return ", ".join([e.nome for e in obj.etichette.all()])
    get_etichette.short_description = 'Etichette'