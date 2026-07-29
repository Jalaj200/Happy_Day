"""
Forever Us — Settings Package
Automatically selects the correct settings module based on DJANGO_ENV.
"""

import os

from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Determine which settings module to use
environment = os.getenv("DJANGO_ENV", "development").lower()

if environment == "production":
    from forever_us.settings.production import *  # noqa: F401, F403
else:
    from forever_us.settings.development import *  # noqa: F401, F403
