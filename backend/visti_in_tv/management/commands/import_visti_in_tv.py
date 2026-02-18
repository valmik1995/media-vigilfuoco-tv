import json
import re
import requests
import os
import csv
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from django.core.files import File
from django.db import transaction
from tempfile import NamedTemporaryFile
from visti_in_tv.models import VistoInTv 

class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('json_file', type=str)
        parser.add_argument('--base-url', type=str, default='https://www.vigilfuoco.tv')

    def download_media(self, field_attr, url_path, base_url, codice_prog):
        if not url_path or url_path == "None": return None
        
        clean_path = url_path.split(',')[0].strip()
        # IMPORTANTE: Costruiamo il percorso relativo includendo il codice
        # Questo forzerà Django a creare la sottocartella corretta
        filename_with_path = os.path.join(codice_prog, os.path.basename(clean_path))
        
        full_url = f"{base_url}{clean_path if clean_path.startswith('/') else '/' + clean_path}"

        try:
            r = requests.get(full_url, headers={'User-Agent': 'Mozilla/5.0'}, timeout=30, stream=True)
            if r.status_code == 200:
                temp_file = NamedTemporaryFile(delete=True)
                for chunk in r.iter_content(chunk_size=8192):
                    temp_file.write(chunk)
                temp_file.flush()
                
                # Salviamo usando il percorso che include il codice progressivo
                field_attr.save(filename_with_path, File(temp_file), save=False)
                return field_attr.name 
        except Exception:
            pass
        return None

    def handle(self, *args, **options):
        with open(options['json_file'], 'r', encoding='utf-8') as f:
            data = json.load(f)

        base_url = options['base_url'].rstrip('/')
        ultimo = VistoInTv.objects.count()
        # 1. Definiamo il percorso verso static/csv/
        # Usiamo settings.BASE_DIR per essere sicuri di partire dalla radice del progetto
        from django.conf import settings
        static_csv_dir = os.path.join(settings.BASE_DIR, 'static', 'csv')
        
        # 2. Creiamo la cartella se non esiste (fondamentale!)
        if not os.path.exists(static_csv_dir):
            os.makedirs(static_csv_dir)
            self.stdout.write(f"Cartella creata: {static_csv_dir}")

        csv_file = os.path.join(static_csv_dir, 'report_migrazione_visti_in_tv.csv')

        with open(csv_file, 'w', newline='', encoding='utf-8') as c_file:
            writer = csv.writer(c_file)
            # Aggiunto il campo TITOLO nell'intestazione
            writer.writerow(['Codice', 'Titolo', 'Tipo', 'Sorgente (Drupal)', 'Destinazione (Django)'])

            for i, item in enumerate(data, start=ultimo + 1):
                title = item.get('title', '').strip()
                codice_prog = f"tv{i:05d}" 
                new_slug = slugify(title)[:255]
                
                with transaction.atomic():
                    visto, _ = VistoInTv.objects.update_or_create(
                        slug=new_slug,
                        defaults={
                            'title': title,
                            'codice_cartella': codice_prog,
                            'body': re.sub(r'<[^>]+>', '', item.get('body', '')),
                            'data': self.extract_date(item.get('field_data', '')),
                        }
                    )

                    # 1. Redirect Pagina
                    old_link = item.get('view_node') or item.get('path', 'N/A')
                    new_link = f"/visti-in-tv/{new_slug}/"
                    writer.writerow([codice_prog, title, 'PAGINA', old_link, new_link])

                    # 2. Redirect Immagine
                    if item.get('field_image'):
                        new_img_path = self.download_media(visto.immagine, item['field_image'], base_url, codice_prog)
                        if new_img_path:
                            writer.writerow([codice_prog, title, 'IMMAGINE', item['field_image'], f"/media/{new_img_path}"])

                    # 3. Redirect Video
                    if item.get('field_video'):
                        new_vid_path = self.download_media(visto.video, item['field_video'], base_url, codice_prog)
                        if new_vid_path:
                            writer.writerow([codice_prog, title, 'VIDEO', item['field_video'], f"/media/{new_vid_path}"])

                    visto.save()
                    self.stdout.write(f"Importato {codice_prog}: {title}")

        self.stdout.write(self.style.SUCCESS(f"Fatto! CSV creato con titoli e sottocartelle: {csv_file}"))

    def extract_date(self, html):
        match = re.search(r'datetime="(\d{4}-\d{2}-\d{2})', html or '')
        return match.group(1) if match else None