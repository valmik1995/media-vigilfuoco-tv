import os
from django.core.management.base import BaseCommand
from django.db import connections
from django.core.files import File
from galleria.models import Galleria, Categoria, Tag
from django.utils.text import slugify

# LA CLASSE DEVE CHIAMARSI ESATTAMENTE "Command"


class Command(BaseCommand):
    help = 'Importazione dati con Auto-Discovery dei percorsi'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("--- AVVIO MIGRAZIONE ---"))

        # Percorsi da testare per trovare i file media
        # Visto che siamo dentro 'backend', proviamo questi:
        POSSIBLE_ROOTS = [
            '/var/www/html/media',
            '/var/www/html/backend/media',
            '/var/www/html/'
        ]

        with connections['esterno'].cursor() as cursor:
            cursor.execute("""
                SELECT g.title, g.description, g.image, c.name as cat_name, c.slug as cat_slug
                FROM foto_galleria g
                LEFT JOIN foto_categoria c ON g.category_id = c.id
            """)
            rows = cursor.fetchall()

        for row in rows:
            title, description, db_path, cat_name, cat_slug = row

            # Pulizia percorso DB
            clean_db_path = str(db_path).lstrip('/')

            full_path_original = None
            for root in POSSIBLE_ROOTS:
                test_path = os.path.join(root, clean_db_path)
                if os.path.exists(test_path):
                    full_path_original = test_path
                    break

            if not full_path_original:
                self.stderr.write(
                    f"NON TROVATO: {title} | Cercato come: {clean_db_path}")
                continue

            self.stdout.write(self.style.SUCCESS(f"TROVATO: {title}"))

            # Percorsi conservativi per Watermark e Thumbnails
            # Nota: usiamo i nomi che abbiamo visto prima (watermarks e thumbails)
            full_path_wm = full_path_original.replace(
                '/originale/', '/watermarks/')
            full_path_thumb = full_path_original.replace(
                '/originale/', '/thumbails/')

            # Gestione Categoria
            categoria_obj = None
            if cat_name:
                categoria_obj, _ = Categoria.objects.get_or_create(
                    name=cat_name,
                    defaults={'slug': cat_slug or slugify(cat_name)}
                )

            # Creazione oggetto Galleria
            nuovo_item = Galleria(
                title=title,
                description=description or "",
                category=categoria_obj,
            )

            # Salvataggio file ORIGINALE
            with open(full_path_original, 'rb') as f:
                nuovo_item.image_original.save(
                    os.path.basename(clean_db_path), File(f), save=False)

            # Salvataggio WATERMARK (se esiste)
            if os.path.exists(full_path_wm):
                with open(full_path_wm, 'rb') as f:
                    nuovo_item.image_watermarked.save(
                        f"wm_{os.path.basename(clean_db_path)}", File(f), save=False)

            # Salvataggio THUMBNAIL (se esiste)
            if os.path.exists(full_path_thumb):
                with open(full_path_thumb, 'rb') as f:
                    nuovo_item.image_thumbnail.save(
                        f"thumb_{os.path.basename(clean_db_path)}", File(f), save=False)

            nuovo_item.save()

            # Importazione TAG
            self.import_tags(nuovo_item, title)

        self.stdout.write(self.style.SUCCESS("--- MIGRAZIONE COMPLETATA ---"))


    def import_tags(self, nuovo_item, title):
        from django.utils.text import slugify
        with connections['esterno'].cursor() as cursor:
            cursor.execute("""
                    SELECT t.name FROM taggit_tag t
                    JOIN foto_taggedgalleria tg ON t.id = tg.tag_id
                    JOIN foto_galleria g ON tg.content_object_id = g.id
                    WHERE g.title = %s
                """, [title])

            for t_row in cursor.fetchall():
                tag_name = t_row[0].strip()
                tag_slug = slugify(tag_name)
                # Usiamo filter().first() per evitare crash se esiste già
                tag_obj = Tag.objects.filter(slug=tag_slug).first()
                if not tag_obj:
                        tag_obj = Tag.objects.create(name=tag_name, slug=tag_slug)

                nuovo_item.tags.add(tag_obj)
