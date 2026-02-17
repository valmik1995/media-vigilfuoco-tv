from django.core.management.base import BaseCommand
from shared.models import TipologiaIntervento


class Command(BaseCommand):
    help = 'Importa il vocabolario completo delle tipologie di intervento'

    def handle(self, *args, **options):
        dati_grezzi = """
        Addestramento
        Alberi pericolanti
        Alluvione
        Apertura porte e finestre
        Ascensori bloccati
        Assistenza attività Protezione Civile Ospedali
        Assistenza Generica
        Assistenza per abbandono locali e/o ambienti
        Assistenza Popolazione
        Bonifica da insetti
        Cattura folli o alienati
        Cattura folli, trattamento sanitario obbligatorio
        Cedimento sede stradale
        Cedimento terreno, voragine
        Coperture tetti
        Corso
        Crollo generalizzato di opere e constructions
        Crollo parziale di elementi strutturali
        Danni d’acqua in genere
        Danni d’acqua per rottura o fuoriuscita da tubazioni, canali e simili
        Demolizioni
        Di altro tipo di sostanza
        Di sostanza asfissiante
        Di sostanza biologica
        Di sostanza comburente
        Di sostanza combustibile in polvere
        Di sostanza infiammabile seguita da incendio
        Di sostanza infiammabile/combustibile
        Di sostanza radioattiva
        Di sostanza tossica
        Dissesto statico di elementi costruttivi
        Emergenza aeroportuale di altro genere
        Emergenza carrello aeromobile bloccato
        Esplosione (escluso esplosione da sostanza esplodente)
        Esplosione da sostanza esplodente
        Frane
        Fuga gas
        Igienizzazione locali pubblici o aree esterne
        Incendi natanti diversi da navi e traghetti
        Incendio aeromobile
        Incendio bosco, sterpaglie, colture
        Incendio Bus
        Incendio ed esplosione
        Incendio in sedime aeroportuale
        Incendio nave o traghetto
        Incendio normale (generico)
        -incendio abitazione
        -Incendio autocarro
        -Incendio autovettura
        -Incendio deposito
        -Incendio fabbrica
        -Incendio negozio
        incendio rifiuti
        Incidente aeromobile di altro genere
        Incidente ferroviario
        Incidente nautico
        Incidente seguito da incendio di mezzo trasportante merci pericolose
        Incidente stradale con mezzo trasportante merci pericolose
        Incidente stradale generico
        Incidente stradale in galleria
        Incidenti sul lavoro
        Inquinamento acque superficiali o di falda
        Inquinamento di aria
        Lavaggio strada
        Maltempo
        Mancata adozione di dispositivi di protezione individuale
        Messa in sicurezza di imbarcazioni, natanti e/o galleggianti
        Messa in sicurezza impianti tecnologici di servizio (acqua, energia elettrica, gas)
        Messa in sicurezza serbatoi GPL
        Missione Internazionale
        Monitoraggio strumentale presenza di sostanze pericolose
        Montaggio Campo Base
        Operazioni antinquinamento
        Opere provvisionali con progettazione
        Opere provvisionali senza progettazione
        Progettazione opere provvisionali
        Prosciugamento in genere
        Recupero aeromobile
        Recupero animali
        Recupero animali morti
        Recupero autovetture e veicoli
        Recupero con verricello elicottero
        Recupero di ostacoli alia navigazione
        Recupero di piccoli natanti
        Recupero merci avariate
        Recupero merci e beni
        Recupero Opere d'Arte
        Recupero parafulmini radioattivi
        Recupero salme
        Recupero sostanza pericolosa
        Recupero sostanze radioattive
        Ribaltamento di mezzo trasportante merci pericolose
        Ricerca aeromobile, ul.pager__items li.is-active a:hover
        Ricerca da allarme COSPAS e simili
        Ricerca e ricognizione aerea
        Ricerca e/o soccorso a persona in mare (SAR)
        Ricerca e/o soccorso in ambiente acquatico di imbarcazioni o natanti
        Ricerca persona (SAR)
        Rifornimento idrico
        Rimozione macerie
        Rimozione neve dai tetti
        Rimozione ostacoli non dovuti al traffico
        Salvataggio animali
        Salvataggio persone
        Scoppio (cedimento meccanico)
        Servizio di assistenza (generico)
        Smontaggio controllato di elementi costruttivi
        Soccorso a imbarcazione senza governo
        Soccorso a persone
        Sopralluoghi e verifiche di stabilità su edifici, manufatti, cedimenti, frane, voragini
        Straripamenti, inondazioni, mareggiate
        Supporto ai Sindaci attività informazione
        Supporto gestione comunale persone senza dimora
        Supporto nautico per operazioni a terra
        Supporto trasporto materiale urgente
        Trasporto al gancio baricentrico elicottero
        Trasporto ammalati o infortunati
        Travaso Cisterna
        Tromba d'Aria
        Valanghe
        Valanghe, slavine
        Visita istituzionale
        """

        linee = dati_grezzi.strip().split('\n')
        creati = 0

        for linea in linee:
            # Pulizia: togliamo spazi e il trattino iniziale se presente
            nome = linea.strip().lstrip('-').strip()

            if not nome:
                continue

            # Gestione caso sporco nel tuo elenco (quello con l'hover CSS)
            if "ul.pager" in nome:
                nome = "Ricerca aeromobile"

            obj, created = TipologiaIntervento.objects.get_or_create(
                name=nome
            )
            if created:
                creati += 1

        self.stdout.write(self.style.SUCCESS(
            f'Importazione completata! Aggiunte {creati} tipologie.'))
