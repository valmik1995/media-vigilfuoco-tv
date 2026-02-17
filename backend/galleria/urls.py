# video/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GalleriaViewSet, CategoriaViewSet

# Il router gestisce automaticamente rotte come /api/video/ e /api/video/{id}/
router = DefaultRouter()
router.register(r'categorie', CategoriaViewSet, basename='categoria')
router.register(r'', GalleriaViewSet, basename='galleria')

urlpatterns = [
    path('', include(router.urls)),
]
