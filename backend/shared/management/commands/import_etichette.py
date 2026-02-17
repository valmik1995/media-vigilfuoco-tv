import os
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from django.db import transaction
from shared.models import Etichette


class Command(BaseCommand):
    help = 'Importa le Etichette da un file normalizzando i nomi'

    def add_arguments(self, parser):
        parser.add_argument('file_path', type=str,
                            help='Percorso del file etichette.txt')

    def handle(self, *args, **options):
        file_path = options['file_path']

        if not os.path.exists(file_path):
            base_path = os.path.dirname(os.path.abspath(__file__))
            file_path = os.path.join(base_path, file_path)

        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(
                f"File non trovato: {file_path}"))
            return

        with open(file_path, 'r', encoding='utf-8') as f:
            righe = [line.strip() for line in f if line.strip()]

        creati, uniti = 0, 0

        with transaction.atomic():
            for riga in righe:
                # Pulizia base
                nome_pulito = riga.lstrip('-').strip()

                if not nome_pulito:
                    continue

                # Evitiamo il DataError troncando a 100
                if len(nome_pulito) > 100:
                    nome_pulito = nome_pulito[:100]

                # Get or Create Case-Insensitive
                obj, created = Etichette.objects.get_or_create(
                    nome__iexact=nome_pulito,
                    defaults={
                        'nome': nome_pulito,
                        'slug': slugify(nome_pulito)[:100]
                    }
                )

                if created:
                    creati += 1
                else:
                    uniti += 1

        self.stdout.write(self.style.SUCCESS(
            f"Etichette: {creati} create, {uniti} già presenti."))
