from pillow_heif import register_heif_opener
register_heif_opener() # Registrazione globale
from django.contrib.gis.db import models
from PIL import Image
import os
from django.conf import settings
from io import BytesIO
from django.core.files.base import ContentFile

class Photo(models.Model):
    file = models.ImageField(upload_to='originali/%Y/%m/')
    watermarked_file = models.ImageField(upload_to='pubblicati/%Y/%m/', null=True, blank=True)
    posizione = models.PointField(srid=4326, null=True, blank=True)
    data_caricamento = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # 1. TRASFORMAZIONE HEIC -> JPG (In memoria)
        if self.file and self.file.name.lower().endswith(('.heic', '.heif')):
            img = Image.open(self.file)
            buffer = BytesIO()
            # Forza la conversione in RGB (essenziale per JPEG)
            img.convert("RGB").save(buffer, format='JPEG', quality=95)
            
            new_name = os.path.splitext(os.path.basename(self.file.name))[0] + ".jpg"
            # Sostituiamo il file in memoria prima del salvataggio definitivo
            self.file = ContentFile(buffer.getvalue(), name=new_name)

        # 2. CREAZIONE WATERMARK (Su file già convertito)
        if self.file and not self.watermarked_file:
            self.apply_watermark()
            
        super().save(*args, **kwargs)

    def apply_watermark(self):
        try:
            base_image = Image.open(self.file).convert("RGBA")
            logo_path = os.path.join(settings.BASE_DIR, 'static/img/logo.png')
            
            if not os.path.exists(logo_path):
                return 

            watermark = Image.open(logo_path).convert("RGBA")
            
            # Ridimensionamento
            width, height = base_image.size
            wm_width = int(width * 0.15)
            wm_height = int(watermark.height * (wm_width / watermark.width))
            watermark = watermark.resize((wm_width, wm_height), Image.Resampling.LANCZOS)

            # Posizionamento
            margin = int(width * 0.02)
            position = (width - wm_width - margin, height - wm_height - margin)

            # Composizione
            transparent = Image.new("RGBA", (width, height), (0, 0, 0, 0))
            transparent.paste(base_image, (0, 0))
            transparent.paste(watermark, position, mask=watermark)
            
            output = BytesIO()
            transparent.convert("RGB").save(output, format='JPEG', quality=90)
            
            filename = f"wm_{os.path.splitext(os.path.basename(self.file.name))[0]}.jpg"
            # save=False evita il loop di salvataggio infinito
            self.watermarked_file.save(filename, ContentFile(output.getvalue()), save=False)
        except Exception as e:
            print(f"Errore Watermark: {e}")