import os
from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.core.files.base import ContentFile
from PIL import Image, ImageOps
from io import BytesIO

# --- CATEGORIE ---


class Categoria(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    parent = models.ForeignKey(
        'self', related_name='children', on_delete=models.CASCADE, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        verbose_name = 'Categoria'
        verbose_name_plural = 'Categorie'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

# --- NUOVO MODELLO TAG ---


class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)

    class Meta:
        verbose_name = 'Tag'
        verbose_name_plural = 'Tag'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

# --- GALLERIA IMMAGINI ---


class Galleria(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    category = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    # Immagini
    image_original = models.ImageField(upload_to='galleria/originali/%Y/%m/%d/')
    image_thumbnail = models.ImageField(upload_to='galleria/thumbnails/%Y/%m/%d/', null=True, blank=True)
    image_watermarked = models.ImageField(upload_to='galleria/watermarked/%Y/%m/%d/', null=True, blank=True)

    # Relazione Molti-a-Molti con i nuovi Tag
    tags = models.ManyToManyField(Tag, blank=True, related_name='items')

    gruppo = models.CharField(max_length=100, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)

# Nel tuo models.py


    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)

        # Se è nuovo, ha l'originale MA non ha ancora il watermark, allora elabora.
        # Se lo script ha già caricato image_watermarked, questo blocco viene saltato.
        if is_new and self.image_original and not self.image_watermarked:
            self.process_images()

    def process_images(self):
        img = Image.open(self.image_original.path)

        # 1. THUMBNAIL (300x300)
        thumb_size = (300, 300)
        thumb_img = ImageOps.fit(img, thumb_size, Image.Resampling.LANCZOS)
        # AGGIUNGI QUESTA RIGA:
        if thumb_img.mode in ("RGBA", "P"):
            thumb_img = thumb_img.convert("RGB")
        thumb_io = BytesIO()
        thumb_img.save(thumb_io, format='JPEG', quality=85)

        thumb_name = os.path.basename(self.image_original.name)
        self.image_thumbnail.save(f"thumb_{thumb_name}", ContentFile(
            thumb_io.getvalue()), save=False)

        # 2. WATERMARK
        from django.conf import settings
        logo_path = os.path.join(settings.BASE_DIR, 'static/img/logo_vvf.png')

        if os.path.exists(logo_path):
            watermark = Image.open(logo_path).convert("RGBA")
            # Proporzione 20%
            wm_width = int(img.width * 0.20)
            wm_height = int(wm_width * watermark.height / watermark.width)
            watermark = watermark.resize(
                (wm_width, wm_height), Image.Resampling.LANCZOS)

            # Posizione Alto a Destra (Margine 5%)
            pos_x = img.width - watermark.width - int(img.width * 0.05)
            pos_y = int(img.height * 0.05)

            # Creiamo una copia per non rovinare l'originale in memoria
            watermarked_img = img.copy().convert("RGB")
            watermarked_img.paste(watermark, (pos_x, pos_y), watermark)

            wm_io = BytesIO()
            watermarked_img.save(wm_io, format='JPEG', quality=90)
            self.image_watermarked.save(
                f"wm_{thumb_name}", ContentFile(wm_io.getvalue()), save=False)

        super().save(update_fields=['image_thumbnail', 'image_watermarked'])

    class Meta:
        verbose_name = 'Immagine Galleria'
        verbose_name_plural = 'Galleria Immagini'
