from rest_framework import serializers
from .models import Storia
from shared.models import Comune, Etichette


class StoriaSerializer(serializers.ModelSerializer):
    comune_nome = serializers.ReadOnlyField(source='comune.nome')
    # Assicurati che il nome 'etichette_nomi' sia presente qui
    etichette_nomi = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='nome'
    )

    class Meta:
        model = Storia
        # Se usi __all__ deve funzionare, altrimenti aggiungilo alla lista
        fields = '__all__'
