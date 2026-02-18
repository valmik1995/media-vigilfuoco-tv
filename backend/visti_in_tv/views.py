from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets, filters
from .models import VistoInTv
from .serializers import VistoInTvSerializer

class VistoInTvViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = VistoInTv.objects.all().order_by('-data')
    serializer_class = VistoInTvSerializer
    # Aggiungiamo il supporto ai filtri
        # 1. DEVI aggiungere questo per abilitare la logica di ricerca
    filter_backends = [filters.SearchFilter]
    
    # 2. DEVI specificare su quali campi cercare. 
    # Se questi campi non esistono nel tuo modello, Django darà errore 500.
    # Verifica se nel tuo modello si chiamano 'title' o 'titolo'!
    search_fields = ['title', 'body'] 

    lookup_field = 'slug'  # Permette a React di usare lo slug nell'URL invece dell'ID
    
    
@api_view(['GET'])
def visto_detail(request, slug):
    try:
        # Cerchiamo la storia specifica nel database media
        visto = VistoInTv.objects.get(slug=slug)
        serializer = VistoInTvSerializer(visto)
        return Response(serializer.data)
    except VistoInTv.DoesNotExist:
        return Response({'error': 'Visto in TV non trovata'}, status=404)