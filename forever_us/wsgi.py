"""
Forever Us — WSGI Configuration
Exposes the WSGI callable as a module-level variable named 'application'.

For production deployment with Gunicorn:
    gunicorn forever_us.wsgi:application
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "forever_us.settings")

application = get_wsgi_application()
