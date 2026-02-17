import uuid
from django.db import models
from django.urls import reverse

class Video(models.Model):
    # Choices per il formato (coerenti con le stringhe usate nel frontend)
    FORMATO_VIDEO_CHOICES = (
        ("640", "640x480"),
        ("1280", "720p (HD)"),
        ("1920", "1080p (Full HD)"),
    )
    
    POSIZIONE_VIDEO_CHOICES = (
        ("VERT", "Verticale"),
        ("ORIZ", "Orizzontale"),
    )
    
    CODINO_CHOICES = (
        ("SENZA", "Senza"),
        ("CODIN", "Codino"),
    )
    
    LOGO_CHOICES = (
        ("SENZ", "Senza"),
        ("LOGO", "Logo"),
    )

    # Stati per il monitoraggio in React (Polling)
    STATUS_CHOICES = (
        ('UPLOADED', 'Caricato'),
        ('PROCESSING', 'In Elaborazione'),
        ('SUCCESS', 'Completato'),
        ('ERROR', 'Errore'),
    )

    # Campi Identificativi
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=120)
    created_date = models.DateTimeField(auto_now_add=True, editable=False)

    # Scelte Utente
    formato = models.CharField(max_length=4, choices=FORMATO_VIDEO_CHOICES, default="1280")
    posizione = models.CharField(max_length=4, choices=POSIZIONE_VIDEO_CHOICES, default='ORIZ')
    codino = models.CharField(max_length=5, choices=CODINO_CHOICES, default='CODIN')
    logo = models.CharField(max_length=4, choices=LOGO_CHOICES, default='LOGO')

    # Gestione File
    video = models.FileField(upload_to='video/original/')
    video_watermarks = models.FileField(upload_to='video/watermarks/', blank=True, null=True)

    # Stato del Task Celery
    progress = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='UPLOADED')
    error_log = models.TextField(blank=True, null=True)

    def get_absolute_url(self):
        return reverse("video:video-detail", kwargs={"id": self.id})

    def __str__(self):
        return self.title

    def delete(self, *args, **kwargs):
        # Cancellazione fisica dei file dai volumi DDEV
        if self.video:
            self.video.delete(save=False)
        if self.video_watermarks:
            self.video_watermarks.delete(save=False)
        super().delete(*args, **kwargs)