# video/views.py
import os
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Video
from .serializers import VideoSerializer
from .tasks import process_video_task



class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer

    def perform_create(self, serializer):
        video_instance = serializer.save()
        # Lanciamo il task Celery subito dopo il salvataggio
        process_video_task.delay(video_instance.id)

    @action(detail=False, methods=['delete'])
    def delete_all(self, request):
        videos = Video.objects.all()
        count = videos.count()

        for video in videos:
            # 1. Elimina il video originale
            if video.video and os.path.isfile(video.video.path):
                os.remove(video.video.path)

            # 2. Elimina il video con watermark (se esiste)
            if video.video_watermarks:
                # Costruiamo il path completo partendo dalla MEDIA_ROOT
                from django.conf import settings
                full_path = os.path.join(
                    settings.MEDIA_ROOT, str(video.video_watermarks))
                if os.path.isfile(full_path):
                    os.remove(full_path)

        # 3. Elimina i record dal database
        videos.delete()

        return Response(
            {"message": f"Eliminati {count} video e i relativi file fisici."},
            status=status.HTTP_204_NO_CONTENT
        )
