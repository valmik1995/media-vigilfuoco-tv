import os
import socket
from pathlib import Path
from dotenv import load_dotenv

# 1. PERCORSI BASE
BASE_DIR = Path(__file__).resolve().parent.parent

# 2. CARICAMENTO VARIABILI D'AMBIENTE (.env)
# Carica il file .env che sta nella root del backend
load_dotenv(BASE_DIR / '.env', override=True)

# 3. SICUREZZA FONDAMENTALE
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-cambiami-in-produzione')
DEBUG = os.getenv('DEBUG', 'False') == 'True'

# Gestione Host (leggi stringa da .env e trasforma in lista)
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '*').split(',')

# 4. CONFIGURAZIONE CORS & CSRF (Unificata)
CORS_ALLOW_ALL_ORIGINS = os.getenv('CORS_ALLOW_ALL_ORIGINS', 'False') == 'True'
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(',')

# CSRF Trusted Origins per DDEV e HTTPS
CSRF_TRUSTED_ORIGINS = os.getenv('CSRF_TRUSTED_ORIGINS', '').split(',')

# Impostazioni Cookie e Proxy per DDEV (HTTPS)
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = 'None'
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
USE_X_FORWARDED_HOST = True
USE_X_FORWARDED_PORT = True

# 5. DEFINIZIONE APPLICAZIONI
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.gis',  # Supporto Geografico
    'django_filters',  # ✨ Aggiungi questa riga
    'corsheaders',        # Gestione CORS
    'rest_framework',     # API
    'watermark',          # Tua App Foto
    'video',              # Tua App Video
    'galleria',           # Tua App Galleria 
    'shared',             # Tua App Dati Condivisi - Vecchie Tassonomie di Drupal
    'storia',             # Tua App Storia - Contenuti di Storia
]

# 6. MIDDLEWARE (Ordine critico per CORS e Sicurezza)
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Deve essere il primo!
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# 7. DATABASE (PostGIS)
DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': os.getenv('DB_NAME', 'db'),
        'USER': os.getenv('DB_USER', 'db'),
        'PASSWORD': os.getenv('DB_PASS', 'db'),
        'HOST': os.getenv('DB_HOST', 'db'),
        'PORT': os.getenv('DB_PORT', '5432'),
    },
    'esterno': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'esterno_db',  # Il nome scelto sopra
        'USER': 'db',         # Utente standard di DDEV
        'PASSWORD': 'db',     # Password standard di DDEV
        'HOST': 'db',
        'PORT': '5432',
    }
}

# 8. VALIDAZIONE PASSWORD
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# 9. INTERNAZIONALIZZAZIONE
LANGUAGE_CODE = 'it-it'
TIME_ZONE = 'Europe/Rome'
USE_I18N = True
USE_TZ = True

# 10. FILE STATICI E MEDIA
STATIC_URL = 'static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# 11. CELERY (Configurazione Redis per DDEV)
CELERY_BROKER_URL = 'redis://redis:6379/0'
CELERY_RESULT_BACKEND = 'redis://redis:6379/0'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = TIME_ZONE

# 12. LIMITI UPLOAD (500MB per video pesanti)
DATA_UPLOAD_MAX_MEMORY_SIZE = 524288000
FILE_UPLOAD_MAX_MEMORY_SIZE = 524288000


REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 12,  # Numero di gallerie per pagina
}
