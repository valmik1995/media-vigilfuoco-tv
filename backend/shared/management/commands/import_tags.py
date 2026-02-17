import os
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from django.db import transaction
from shared.models import Tags


class Command(BaseCommand):
    help = 'Importa 2000+ tag da un file, normalizzando i duplicati Case-Insensitive'

    def add_arguments(self, parser):
        # Permette di passare il percorso del file come argomento:
        # python manage.py import_tags tags.txt
        parser.add_argument(
            'file_path', type=str, help='Percorso del file .txt o .csv contenente i tag')

    def handle(self, *args, **options):
        file_path = options['file_path']

        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(
                f"Errore: Il file {file_path} non esiste."))
            return

        # Leggiamo i tag dal file (uno per riga)
        with open(file_path, 'r', encoding='utf-8') as f:
            # strip() rimuove spazi bianchi e invii a capo
            tags_grezzi = [line.strip() for line in f if line.strip()]

        self.stdout.write(
            f"Inizio elaborazione di {len(tags_grezzi)} potenziali tag...")

        creati = 0
        uniti = 0

        # Usiamo transaction.atomic per rendere l'importazione velocissima
        with transaction.atomic():
            for nome_grezzo in tags_grezzi:

                # 1. Normalizzazione: "incendio boschivo" -> "Incendio boschivo"
                # Pulizia da eventuali trattini iniziali comuni in Drupal
                nome_pulito = nome_grezzo.lstrip('-').strip().capitalize()

                if not nome_pulito:
                    continue

                # 2. Risoluzione Duplicati Case-Insensitive
                # name__iexact cerca "Incendio Boschivo" anche se nel DB c'è "incendio boschivo"
                obj, created = Tags.objects.get_or_create(
                    name__iexact=nome_pulito,
                    defaults={
                        'name': nome_pulito,
                        'slug': slugify(nome_pulito)
                    }
                )

                if created:
                    creati += 1
                    # Opzionale: decommenta riga sotto per vedere ogni creazione (rallenta un po')
                    # self.stdout.write(self.style.SUCCESS(f"Creato: {obj.name}"))
                else:
                    uniti += 1

        self.stdout.write(self.style.SUCCESS("--- IMPORTAZIONE COMPLETATA ---"))
        self.stdout.write(f"Tag totali processati: {len(tags_grezzi)}")
        self.stdout.write(self.style.SUCCESS(f"Nuovi tag creati: {creati}"))
        self.stdout.write(self.style.WARNING(f"Duplicati uniti: {uniti}"))
