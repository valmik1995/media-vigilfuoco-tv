import os
from django.db import models

def path_visti_tv(instance, filename):
    # Recuperiamo il codice dall'istanza
    codice = instance.codice_cartella
    
    # DEBUG: Questo apparirà nel terminale mentre lo script gira
    print(f"DEBUG: instance.codice_cartella è '{codice}'")
    
    if not codice:
        codice = "generico"
        
    ext = filename.split('.')[-1].lower()
    folder = 'video' if ext in ['mp4', 'm4v', 'mov', 'avi'] else 'immagini'
    
    return os.path.join('visti_in_tv', codice, filename)

class VistoInTv(models.Model):
    # Titolo e Body
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    codice_cartella = models.CharField(max_length=20, blank=True) # Campo per tv00001
    body = models.TextField(blank=True, help_text="Contenuto formattato da Drupal")

    # Data (field_data) - Fondamentale per la sezione Storia
    data = models.DateField()


    # Immagine e Didascalia
    immagine = models.ImageField(upload_to='visti_in_tv/', blank=True, null=True)
    didascalia = models.CharField(max_length=255, blank=True)

    # Tags Aggiuntivi (field_tags -> punta alle Etichette)
    etichette = models.ManyToManyField('shared.Etichette', blank=True, related_name='visti_in_tv')


    # Opzioni di visualizzazione
    prima_pagina = models.BooleanField(default=False)
    video = models.FileField(upload_to='visti_in_tv/', blank=True, null=True)

    class Meta:
        verbose_name = "Visti in TV"
        verbose_name_plural = "Visti in TV"
        # Ordina le visti in tv dalla più recente alla più vecchia
        ordering = ['-data']

    def __str__(self):
        return f"{self.codice_cartella} - {self.title}"
