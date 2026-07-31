#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "Starting build process..."

# Install dependencies
pip install -r requirements.txt

# Collect static files
# Uses the --noinput flag to prevent interactive prompts during the automated build
python manage.py collectstatic --noinput

echo "Build process completed successfully."
