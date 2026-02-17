import magic # Se non lo hai: dvpip install python-magic
from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible

@deconstructible
class FileMimeValidator:
    def __init__(self, mime_types=['image/jpeg', 'image/png', 'image/gif']):
        self.mime_types = mime_types

    def __call__(self, value):
        # Verifica il MIME type reale, non solo l'estensione
        mime = magic.from_buffer(value.read(2048), mime=True)
        value.seek(0) # Torna all'inizio del file dopo la lettura
        if mime not in self.mime_types:
            raise ValidationError(f'Tipo di file non supportato: {mime}. Usa JPG o PNG.')

@deconstructible
class FileMimeValidatorHeic:
    def __init__(self, mime_types=['image/heic', 'image/heif', 'application/octet-stream']):
        self.mime_types = mime_types

    def __call__(self, value):
        mime = magic.from_buffer(value.read(2048), mime=True)
        value.seek(0)
        # Molti browser leggono HEIC come octet-stream, quindi siamo flessibili
        if mime not in self.mime_types and not value.name.lower().endswith(('.heic', '.heif')):
            raise ValidationError(f'Il file non sembra un formato HEIC valido.')