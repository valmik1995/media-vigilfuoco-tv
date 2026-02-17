from rest_framework import serializers
from .models import Galleria, Categoria, Tag


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'name', 'slug']  # Questi sono i campi che hai nel DB
        
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']

class GalleriaSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Galleria
        fields = ['id', 'title', 'created_date', 'description', 'image_thumbnail', 'image_watermarked', 'category_name', 'tags']