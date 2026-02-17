# video/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VideoViewSet

# Il router gestisce automaticamente rotte come /api/video/ e /api/video/{id}/
router = DefaultRouter()
router.register(r'', VideoViewSet, basename='video')

urlpatterns = [
    path('', include(router.urls)),
]