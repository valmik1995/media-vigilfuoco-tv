import json
import re
import requests
import os
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from django.contrib.gis.geos import Point
from django.core.files import File
from django.db import transaction
from tempfile import NamedTemporaryFile

# Importiamo i modelli corretti dal tuo models.py
from storia.models import Storia
from shared.models import Comune, Etichette


class Command(BaseCommand):
    help = 'Importa Storia: field_tags -> Etichette, field_comune -> Comune + Media'

    def add_arguments(self, parser):
        parser.add_argument('json_file', type=str)
        parser.add_argument('--base-url', type=str,
                            default='https://www.vigilfuoco.tv')

    def extract_coords(self, html_maps):
        if not html_maps:
            return None
        lat = re.search(r'property="latitude" content="([^"]+)"', html_maps)
        lon = re.search(r'property="longitude" content="([^"]+)"', html_maps)
        if lat and lon:
            return Point(float(lon.group(1)), float(lat.group(1)), srid=4326)
        return None

    def extract_date(self, html_date):
        if not html_date:
            return "2000-01-01"
        match = re.search(r'datetime="(\d{4}-\d{2}-\d{2})', html_date)
        return match.group(1) if match else "2000-01-01"

    def download_media(self, field_attr, url_path, base_url):
        """Scarica l'immagine o il video dal server originale"""
        if not url_path or url_path == "" or url_path == "None":
            return

        # Prende il primo file se Drupal ne esporta una lista
        clean_path = url_path.split(',')[0].strip()
        if not clean_path.startswith('/'):
            clean_path = '/' + clean_path

        full_url = f"{base_url}{clean_path}"

        try:
            # User-agent per evitare blocchi
            headers = {'User-Agent': 'Mozilla/5.0'}
            r = requests.get(full_url, headers=headers,
                             timeout=20, stream=True)

            if r.status_code == 200:
                filename = os.path.basename(clean_path)
                temp_file = NamedTemporaryFile(delete=True)
                for chunk in r.iter_content(chunk_size=8192):
                    temp_file.write(chunk)
                temp_file.flush()

                # Salvataggio nel campo del modello
                field_attr.save(filename, File(temp_file), save=False)
                return True
        except Exception as e:
            self.stdout.write(self.style.ERROR(
                f"Errore download {full_url}: {str(e)}"))
        return False

    def handle(self, *args, **options):
        with open(options['json_file'], 'r', encoding='utf-8') as f:
            data = json.load(f)

        base_url = options['base_url'].rstrip('/')
        count = 0

        for item in data:
            titolo = item['title'].strip()

            with transaction.atomic():
                # 1. Creazione/Aggiornamento Storia
                storia, created = Storia.objects.update_or_create(
                    slug=slugify(titolo)[:255],
                    defaults={
                        'titolo': titolo,
                        'body': item.get('body', ''),
                        'data': self.extract_date(item.get('field_data', '')),
                        'posizione': self.extract_coords(item.get('field_maps', '')),
                    }
                )

                # 2. Comune (field_comune -> Comune)
                if item.get('field_comune'):
                    nome_c = item['field_comune'].split(',')[0].strip()
                    comune_obj = Comune.objects.filter(
                        nome__iexact=nome_c).first()
                    if comune_obj:
                        storia.comune = comune_obj

                # 3. Etichette (field_tags -> Etichette)
                if item.get('field_tags'):
                    # Pulisce la stringa (es: "norcia, terremoto")
                    nomi_tags = [n.strip()
                                 for n in item['field_tags'].split(',') if n.strip()]
                    for nome_tag in nomi_tags:
                        # Usiamo nome__iexact assumendo che il campo si chiami 'nome'
                        # Se il tuo modello Etichette usa un altro nome campo (es. 'name'), cambialo qui
                        etichetta_obj, _ = Etichette.objects.get_or_create(
                            nome__iexact=nome_tag,
                            defaults={'nome': nome_tag, 'slug': slugify(nome_tag)[
                                :100]}
                        )
                        storia.etichette.add(etichetta_obj)

                # 4. Media
                if item.get('field_image'):
                    self.download_media(
                        storia.immagine, item['field_image'], base_url)
                if item.get('field_video'):
                    self.download_media(
                        storia.video, item['field_video'], base_url)

                storia.save()
                count += 1
                self.stdout.write(self.style.SUCCESS(f"Processato: {titolo}"))

        self.stdout.write(self.style.SUCCESS(
            f"Importazione completata con successo!"))
