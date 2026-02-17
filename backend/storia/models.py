from django.contrib.gis.db import models


class Storia(models.Model):
    # Titolo e Body
    titolo = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    body = models.TextField(blank=True, help_text="Contenuto formattato da Drupal")

    # Data (field_data) - Fondamentale per la sezione Storia
    data = models.DateField()

    # Comune - Stato (field_comune -> punta ai Tag che abbiamo importato)
    comune = models.ForeignKey(
        'shared.Comune',
        on_delete=models.SET_NULL,
        null=True,
        related_name='storie_comune'
    )
    
    # Il campo Maps di Drupal diventa un PointField
    # SRID 4326 è lo standard per coordinate GPS (Lat/Lon)
    posizione = models.PointField(srid=4326, null=True, blank=True)

    # Immagine e Didascalia
    immagine = models.ImageField(upload_to='storia/image/', blank=True, null=True)
    didascalia = models.CharField(max_length=255, blank=True)

    # Tags Aggiuntivi (field_tags -> punta alle Etichette)
    etichette = models.ManyToManyField('shared.Etichette', blank=True, related_name='storie')


    # Opzioni di visualizzazione
    prima_pagina = models.BooleanField(default=False)
    video = models.FileField(upload_to='storia/video/', blank=True, null=True)

    class Meta:
        verbose_name = "Storia"
        verbose_name_plural = "Storie"
        # Ordina le storie dalla più recente alla più vecchia
        ordering = ['-data']

    def __str__(self):
        return f"{self.data.year} - {self.titolo}"
