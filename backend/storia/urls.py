# storia/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StoriaViewSet  # <--- Assicurati che il nome sia corretto

router = DefaultRouter()
# Lasciando la stringa vuota r'', l'endpoint sarà /api/storia/
# Se metti r'lista', l'endpoint sarà /api/storia/lista/
router.register(r'', StoriaViewSet, basename='storia')

urlpatterns = [
    path('', include(router.urls)),
]
