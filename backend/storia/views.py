from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Storia
from .serializers import StoriaSerializer


class StoriaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API per le Storie: supporta ricerca testuale e filtri per Comune/Etichetta.
    """
    queryset = Storia.objects.all().select_related(
        'comune').prefetch_related('etichette')
    serializer_class = StoriaSerializer

    # Aggiungiamo il supporto ai filtri
    filter_backends = [DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['comune__nome', 'etichette__nome', 'prima_pagina']
    search_fields = ['titolo', 'body']
    ordering_fields = ['data', 'titolo']
    lookup_field = 'slug'  # Permette a React di usare lo slug nell'URL invece dell'ID
