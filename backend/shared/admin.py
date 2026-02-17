from .models import Mezzo
from django.contrib import admin
from .models import Regione, Provincia, Comune, Mezzo, TipologiaIntervento, Tags, Specializzazione, Etichette


@admin.register(Regione)
class RegioneAdmin(admin.ModelAdmin):
    # Colonne visualizzate nella lista
    list_display = ('nome', 'slug')
    # Permette di cliccare sul nome per modificare
    list_display_links = ('nome',)
    # Barra di ricerca
    search_fields = ('nome',)
    # Autocompila lo slug mentre scrivi il nome
    prepopulated_fields = {"slug": ("nome",)}


@admin.register(Provincia)
class ProvinciaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'sigla', 'regione', 'slug')
    list_filter = ('regione',)
    search_fields = ('nome', 'sigla')
    # Lo slug della provincia si basa su nome e sigla
    prepopulated_fields = {"slug": ("nome", "sigla")}
    # Ordina per regione e poi per nome
    list_select_related = ('regione',)


@admin.register(Comune)
class ComuneAdmin(admin.ModelAdmin):
    list_display = ('nome', 'provincia', 'get_regione', 'slug')
    # Filtri laterali: utilissimi per filtrare migliaia di comuni
    list_filter = ('provincia__regione', 'provincia')
    search_fields = ('nome', 'provincia__nome')
    prepopulated_fields = {"slug": ("nome",)}
    # Ottimizzazione query per non rallentare il database
    list_select_related = ('provincia', 'provincia__regione')

    # Metodo per mostrare la Regione nella tabella dei Comuni
    @admin.display(description='Regione', ordering='provincia__regione__nome')
    def get_regione(self, obj):
        return obj.provincia.regione.nome


@admin.register(Mezzo)
class MezzoAdmin(admin.ModelAdmin):
    list_display = ('sigla', 'nome', 'slug')
    search_fields = ('sigla', 'nome')
    prepopulated_fields = {"slug": ("sigla",)}


@admin.register(TipologiaIntervento)
class TipologiaInterventoAdmin(admin.ModelAdmin):
    # Colonne visualizzate nella lista
    list_display = ('name', 'slug')

    # Barra di ricerca per trovare velocemente una tipologia
    search_fields = ('name', 'slug')

    # Generazione automatica dello slug in tempo reale nell'admin
    prepopulated_fields = {'slug': ('name',)}

    # Ordinamento predefinito
    ordering = ('name',)

    # Numero di elementi per pagina (visto che l'elenco è lungo)
    list_per_page = 50

    # Opzionale: permette di modificare il nome direttamente dalla lista
    # list_editable = ('name',)


@admin.register(Tags)
class TagsAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    # Questo popola lo slug automaticamente nell'interfaccia admin
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Specializzazione)
class SpecializzazioneAdmin(admin.ModelAdmin):
    # Visualizza il nome, il padre (categoria) e lo slug nella lista principale
    list_display = ('nome', 'parent', 'slug')

    # Permette di filtrare per categoria padre sulla destra
    list_filter = ('parent',)

    # Aggiunge una barra di ricerca per nome e nome del padre
    search_fields = ('nome', 'parent__nome')

    # Genera automaticamente lo slug mentre scrivi il nome nell'admin
    prepopulated_fields = {'slug': ('nome',)}

    # Ordina i risultati: prima per padre, poi per nome
    ordering = ('parent__nome', 'nome')

    # Opzionale: Se vuoi vedere i "figli" direttamente dentro la pagina del "padre"
    class SpecializzazioneInline(admin.TabularInline):
        model = Specializzazione
        extra = 1
        fk_name = 'parent'
        verbose_name = "Sotto-specializzazione"
        verbose_name_plural = "Sotto-specializzazioni"

    inlines = [SpecializzazioneInline]


@admin.register(Etichette)
class EtichetteAdmin(admin.ModelAdmin):
    list_display = ('nome', 'slug')
    search_fields = ('nome',)
    prepopulated_fields = {'slug': ('nome',)}
