from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .serializers import PhotoUploadSerializer
from .models import Photo
from rest_framework.decorators import api_view
from django.utils import timezone


class PhotoUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        # Prendiamo tutti i file inviati sotto la chiave 'file'
        files = request.FILES.getlist('file')
        responses = []
        
        for f in files:
            # AGGIUNTO: context={'request': request} 
            # Questo permette al SerializerMethodField di costruire l'URL completo
            serializer = PhotoUploadSerializer(
                data={'file': f}, 
                context={'request': request}
            )
            
            if serializer.is_valid():
                serializer.save()
                responses.append(serializer.data)
            else:
                # Se un file fallisce (es. formato non valido), restituiamo l'errore subito
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Restituiamo la lista di tutte le foto caricate e processate
        return Response(responses, status=status.HTTP_201_CREATED)

class PhotoDetailView(APIView):
    def delete(self, request, pk):
        try:
            photo = Photo.objects.get(pk=pk)
            # L'eliminazione del modello in Django di solito non cancella i file fisici 
            # a meno che non sia configurato un segnale (post_delete).
            # Per sicurezza li cancelliamo a mano:
            if photo.file:
                photo.file.delete(save=False)
            if photo.watermarked_file:
                photo.watermarked_file.delete(save=False)
            
            photo.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Photo.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
class PhotoListView(ListAPIView):
    """Vista per ottenere l'elenco di tutte le foto"""
    queryset = Photo.objects.all().order_by('-data_caricamento')
    serializer_class = PhotoUploadSerializer

    # --- AGGIUNGI QUESTA RIGA ---
    pagination_class = None
    # ----------------------------

    # Ricorda di passare il context per avere gli URL completi (HTTPS)
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
    


@api_view(['GET'])
def dashboard_stats(self):
    today = timezone.now().date()
    return Response({
        "total_photos": Photo.objects.count(),
        "today_uploads": Photo.objects.filter(data_caricamento__date=today).count(),
        "last_upload": Photo.objects.latest('data_caricamento').data_caricamento if Photo.objects.exists() else None,
        "recent_photos": Photo.objects.order_by('-data_caricamento')[:4].values('id', 'watermarked_file')
    })
    
@api_view(['DELETE'])
def delete_all_photos(request):
    try:
        # Recupera tutte le foto
        photos = Photo.objects.all()
        count = photos.count()
        
        # Elimina i file fisici se necessario (opzionale ma consigliato)
        for photo in photos:
            photo.file.delete()
            if photo.watermarked_file:
                photo.watermarked_file.delete()
        
        # Elimina i record dal database
        photos.delete()
        
        return Response({"message": f"Eliminate {count} foto con successo."}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)