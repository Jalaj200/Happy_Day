"""
Forever Us — Development Settings
Extends base settings with development-friendly overrides.
"""

from forever_us.settings.base import *  # noqa: F401, F403


# ──────────────────────────────────────────────
# Debug Mode
# ──────────────────────────────────────────────
DEBUG = True


# ──────────────────────────────────────────────
# Allowed Hosts
# ──────────────────────────────────────────────
ALLOWED_HOSTS = ["*"]


# ──────────────────────────────────────────────
# Email Backend (prints emails to console in development)
# ──────────────────────────────────────────────
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
