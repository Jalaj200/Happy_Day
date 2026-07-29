"""
Forever Us — Base Settings
Shared configuration for all environments (development & production).
"""

import os
from pathlib import Path

# ──────────────────────────────────────────────
# Path Configuration
# ──────────────────────────────────────────────
# BASE_DIR points to the project root: Happy Day/
BASE_DIR = Path(__file__).resolve().parent.parent.parent


# ──────────────────────────────────────────────
# Security
# ──────────────────────────────────────────────
SECRET_KEY = os.getenv(
    "DJANGO_SECRET_KEY",
    "django-insecure-fallback-key-change-me",
)

# ALLOWED_HOSTS is set in development.py and production.py
ALLOWED_HOSTS = []


# ──────────────────────────────────────────────
# Application Definition
# ──────────────────────────────────────────────
INSTALLED_APPS = [
    # Django built-in apps
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Project apps
    "love.apps.LoveConfig",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "forever_us.urls"


# ──────────────────────────────────────────────
# Templates
# ──────────────────────────────────────────────
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [
            BASE_DIR / "templates",
        ],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",

                # Custom context processors
                "love.context_processors.forever_us_context",
            ],
        },
    },
]


# ──────────────────────────────────────────────
# WSGI / ASGI
# ──────────────────────────────────────────────
WSGI_APPLICATION = "forever_us.wsgi.application"
ASGI_APPLICATION = "forever_us.asgi.application"


# ──────────────────────────────────────────────
# Database — MySQL via mysqlclient
# ──────────────────────────────────────────────
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": os.getenv("DB_NAME", "forever_us_db"),
        "USER": os.getenv("DB_USER", "root"),
        "PASSWORD": os.getenv("DB_PASSWORD", ""),
        "HOST": os.getenv("DB_HOST", "localhost"),
        "PORT": os.getenv("DB_PORT", "3306"),
        "OPTIONS": {
            "charset": "utf8mb4",
            "init_command": "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}


# ──────────────────────────────────────────────
# Password Validation
# ──────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# ──────────────────────────────────────────────
# Internationalization
# ──────────────────────────────────────────────
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = True


# ──────────────────────────────────────────────
# Static Files (CSS, JavaScript, Images, Fonts)
# ──────────────────────────────────────────────
STATIC_URL = "/static/"

# Additional directories where Django will search for static files
STATICFILES_DIRS = [
    BASE_DIR / "static",
]

# Directory where collectstatic will gather all static files for production
STATIC_ROOT = BASE_DIR / "staticfiles"


# ──────────────────────────────────────────────
# Media Files (User-Uploaded Content)
# ──────────────────────────────────────────────
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"


# ──────────────────────────────────────────────
# Default Primary Key Field Type
# ──────────────────────────────────────────────
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
