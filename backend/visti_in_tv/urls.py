from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VistoInTvViewSet, visto_detail

router = DefaultRouter()
router.register(r'', VistoInTvViewSet, basename='visti-in-tv')

urlpatterns = [
    path('', include(router.urls)),
    path('<int:slug>/', visto_detail, name='visto-detail'),
]