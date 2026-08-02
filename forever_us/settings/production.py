"""
Forever Us — Production Settings
Extends base settings with security-hardened overrides for deployment.
"""

import os

from forever_us.settings.base import *  # noqa: F401, F403


# ──────────────────────────────────────────────
# Debug Mode — NEVER True in production
# ──────────────────────────────────────────────
DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "yes")


# ──────────────────────────────────────────────
# Allowed Hosts (loaded from .env)
# ──────────────────────────────────────────────
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "").split(",")
CSRF_TRUSTED_ORIGINS = os.getenv("CSRF_TRUSTED_ORIGINS", "").split(",")


# ──────────────────────────────────────────────
# Security Hardening
# ──────────────────────────────────────────────

# HTTPS / SSL
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# HSTS — tell browsers to always use HTTPS
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Cookies
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = False

# Content Security
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = "DENY"
