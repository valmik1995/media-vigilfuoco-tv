import json
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from shared.models import Regione, Provincia, Comune


class Command(BaseCommand):
    help = 'Importa la tassonomia geografica completa con mappatura sigle'

    # Dizionario completo delle province italiane
    SIGLE_MAP = {
        # Abruzzo
        'Chieti': 'CH', "L'Aquila": 'AQ', 'Pescara': 'PE', 'Teramo': 'TE',
        # Basilicata
        'Matera': 'MT', 'Potenza': 'PZ',
        # Calabria
        'Catanzaro': 'CZ', 'Cosenza': 'CS', 'Crotone': 'KR', 'Reggio Calabria': 'RC', 'Vibo Valentia': 'VV',
        # Campania
        'Avellino': 'AV', 'Benevento': 'BN', 'Caserta': 'CE', 'Napoli': 'NA', 'Salerno': 'SA',
        # Emilia-Romagna
        'Bologna': 'BO', 'Ferrara': 'FE', 'Forlì-Cesena': 'FC', 'Modena': 'MO', 'Parma': 'PR', 'Piacenza': 'PC', 'Ravenna': 'RA', 'Reggio Emilia': 'RE', 'Rimini': 'RN',
        # Friuli-Venezia Giulia
        'Gorizia': 'GO', 'Pordenone': 'PN', 'Trieste': 'TS', 'Udine': 'UD',
        # Lazio
        'Frosinone': 'FR', 'Latina': 'LT', 'Rieti': 'RI', 'Roma': 'RM', 'Viterbo': 'VT',
        # Liguria
        'Genova': 'GE', 'Imperia': 'IM', 'La Spezia': 'SP', 'Savona': 'SV',
        # Lombardia
        'Bergamo': 'BG', 'Brescia': 'BS', 'Como': 'CO', 'Cremona': 'CR', 'Lecco': 'LC', 'Lodi': 'LO', 'Mantova': 'MN', 'Milano': 'MI', 'Monza e della Brianza': 'MB', 'Pavia': 'PV', 'Sondrio': 'SO', 'Varese': 'VA',
        # Marche
        'Ancona': 'AN', 'Ascoli Piceno': 'AP', 'Fermo': 'FM', 'Macerata': 'MC', 'Pesaro e Urbino': 'PU',
        # Molise
        'Campobasso': 'CB', 'Isernia': 'IS',
        # Piemonte
        'Alessandria': 'AL', 'Asti': 'AT', 'Biella': 'BI', 'Cuneo': 'CN', 'Novara': 'NO', 'Torino': 'TO', 'Verbano-Cusio-Ossola': 'VB', 'Vercelli': 'VC',
        # Puglia
        'Bari': 'BA', 'Barletta-Andria-Trani': 'BT', 'Brindisi': 'BR', 'Foggia': 'FG', 'Lecce': 'LE', 'Taranto': 'TA',
        # Sardegna
        'Cagliari': 'CA', 'Nuoro': 'NU', 'Oristano': 'OR', 'Sassari': 'SS', 'Sud Sardegna': 'SU',
        # Sicilia
        'Agrigento': 'AG', 'Caltanissetta': 'CL', 'Catania': 'CT', 'Enna': 'EN', 'Messina': 'ME', 'Palermo': 'PA', 'Ragusa': 'RG', 'Siracusa': 'SR', 'Trapani': 'TP',
        # Toscana
        'Arezzo': 'AR', 'Firenze': 'FI', 'Grosseto': 'GR', 'Livorno': 'LI', 'Lucca': 'LU', 'Massa-Carrara': 'MS', 'Pisa': 'PI', 'Pistoia': 'PT', 'Prato': 'PO', 'Siena': 'SI',
        # Trentino-Alto Adige
        'Bolzano': 'BZ', 'Trento': 'TN',
        # Umbria
        'Perugia': 'PG', 'Terni': 'TR',
        # Valle d'Aosta
        "Valle d'Aosta": 'AO',
        # Veneto
        'Belluno': 'BL', 'Padova': 'PD', 'Rovigo': 'RO', 'Treviso': 'TV', 'Venezia': 'VE', 'Verona': 'VR', 'Vicenza': 'VI',
    }

    def handle(self, *args, **options):
        try:
            with open('comune_semplice.json', 'r', encoding='utf-8') as f:
                data = json.load(f)
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR("File non trovato!"))
            return

        # 1. PRE-CARICAMENTO MAPPING
        # Se abbiamo i TID nel JSON, ma le province sono già nel DB, 
        # dobbiamo ricostruire il mapping per i comuni.
        mapping = {}
        
        # Carichiamo Regioni e Province esistenti per mappare i TID di Drupal
        # Nota: Questo presuppone che tu abbia salvato il TID di Drupal in un campo,
        # ma dato che non l'abbiamo fatto, usiamo il NOME come chiave temporanea 
        # o ripercorriamo il JSON.
        
        self.stdout.write("Fase 1 & 2: Mappatura Regioni e Province...")
        for t in data:
            t_id = str(t['tid'])
            parent_id = str(t['parent'])
            
            if parent_id == '0':
                obj, _ = Regione.objects.get_or_create(nome=t['name'])
                mapping[t_id] = obj
            elif parent_id in mapping and isinstance(mapping[parent_id], Regione):
                nome_p = t['name']
                sigla = self.SIGLE_MAP.get(nome_p, f"D{t_id[-1]}")[:2]
                obj, _ = Provincia.objects.get_or_create(
                    nome=nome_p, 
                    regione=mapping[parent_id],
                    defaults={'sigla': sigla}
                )
                mapping[t_id] = obj

        # --- FASE 3: COMUNI ---
        self.stdout.write("Fase 3: Importazione Comuni...")
        conteggio_comuni = 0

        for t in data:
            t_id = str(t['tid'])
            parent_id = str(t['parent'])
            
            # Se il parent è nel mapping ed è una Provincia, allora è un Comune
            if parent_id in mapping and isinstance(mapping[parent_id], Provincia):
                prov_obj = mapping[parent_id]
                comune, created = Comune.objects.get_or_create(
                    nome=t['name'],
                    provincia=prov_obj,
                    defaults={'slug': slugify(f"{t['name']}-{prov_obj.sigla}")}
                )
                if created:
                    conteggio_comuni += 1
                
        self.stdout.write(self.style.SUCCESS(f"Completato! Comuni aggiunti: {conteggio_comuni}"))