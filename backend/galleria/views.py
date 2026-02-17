from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Galleria, Categoria
from .serializers import GalleriaSerializer, CategoriaSerializer
from django_filters.rest_framework import DjangoFilterBackend

class GalleriaViewSet(viewsets.ModelViewSet):
    queryset = Galleria.objects.all().order_by('-created_date')
    serializer_class = GalleriaSerializer
    
    # ⚙️ Configuriamo i motori di filtraggio
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    
    # 🔍 Definiamo i campi per la ricerca testuale (titolo e descrizione)
    search_fields = ['title', 'description', 'tags__name']
    
    # 🏷️ Definiamo i campi per il filtro esatto (categoria)
    # Usiamo la relazione category__name per filtrare tramite il nome della categoria
    filterset_fields = ['category__name', 'tags__name']

class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Un ViewSet che fornisce solo l'azione di 'lista' e 'dettaglio' 
    per le 22 categorie del database.
    """
    queryset = Categoria.objects.all().order_by('name')
    serializer_class = CategoriaSerializer
    # Fondamentale: vogliamo tutte e 22 le categorie insieme per la sidebar
    pagination_class = None
