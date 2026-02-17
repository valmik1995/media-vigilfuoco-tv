# celery.py
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

app = Celery('core')

# Il namespace 'CELERY' significa che tutte le chiavi in settings.py
# devono avere il prefisso CELERY_
app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()
