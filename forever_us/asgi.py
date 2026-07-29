"""
Forever Us — ASGI Configuration
Exposes the ASGI callable as a module-level variable named 'application'.

For async deployment with Uvicorn:
    uvicorn forever_us.asgi:application
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "forever_us.settings")

application = get_asgi_application()
