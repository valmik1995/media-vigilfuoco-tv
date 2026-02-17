import os
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from django.db import transaction
from shared.models import Specializzazione


class Command(BaseCommand):
    help = 'Importa specializzazioni VF mantenendo la gerarchia Padre-Figlio'

    def add_arguments(self, parser):
        parser.add_argument('file_path', type=str,
                            help='Percorso del file .txt')

    def handle(self, *args, **options):
        file_path = options['file_path']

        # Gestione percorso file
        if not os.path.exists(file_path):
            base_path = os.path.dirname(os.path.abspath(__file__))
            file_path = os.path.join(base_path, file_path)

        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(
                f"File non trovato: {file_path}"))
            return

        with open(file_path, 'r', encoding='utf-8') as f:
            righe = [line.strip() for line in f if line.strip()]

        current_parent = None
        creati_padri = 0
        creati_figli = 0

        with transaction.atomic():
            for riga in righe:
                # Se NON inizia con "-", è una Categoria (PADRE)
                if not riga.startswith('-'):
                    nome_padre = riga.strip()[:100]
                    # Get or Create per il Padre
                    current_parent, created = Specializzazione.objects.get_or_create(
                        nome__iexact=nome_padre,
                        parent=None,
                        defaults={
                            'nome': nome_padre,
                            'slug': slugify(nome_padre)[:100]
                        }
                    )
                    if created:
                        creati_padri += 1
                    self.stdout.write(self.style.MIGRATE_LABEL(
                        f"--- Categoria: {nome_padre} ---"))

                # Se INIZIA con "-", è una Specializzazione (FIGLIO)
                else:
                    nome_figlio = riga.lstrip('-').strip()

                    # Fix per il DataError: tronca a 100 caratteri
                    if len(nome_figlio) > 100:
                        nome_figlio = nome_figlio[:100]

                    if not nome_figlio:
                        continue

                    # Creiamo lo slug includendo il padre per evitare duplicati universali
                    slug_unico = slugify(
                        f"{current_parent.nome if current_parent else ''}-{nome_figlio}")[:100]

                    # Get or Create per il Figlio sotto il Padre attuale
                    obj, created = Specializzazione.objects.get_or_create(
                        nome__iexact=nome_figlio,
                        parent=current_parent,
                        defaults={
                            'nome': nome_figlio,
                            'slug': slug_unico
                        }
                    )
                    if created:
                        creati_figli += 1
                        self.stdout.write(f"  > Importato: {nome_figlio}")

        self.stdout.write(self.style.SUCCESS(
            f"\nFINE: {creati_padri} Categorie e {creati_figli} Specializzazioni importate."
        ))
