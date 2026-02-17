from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('watermark.urls')), # Le tue rotte API
    path('api/video/', include('video.urls')),
    path('api/galleria/', include('galleria.urls')),
    path('api/storia/', include('storia.urls')),
]

# Questo permette di vedere le foto caricate nel browser durante lo sviluppo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)