"""
Production WSGI Entrypoint for Zuntra Lead Intelligence
Exposes 'app' for production servers: Waitress, Gunicorn, uWSGI, mod_wsgi, etc.
"""

import sys
from pathlib import Path

# Add backend modules to python path
ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / "backend" / "ui"))
sys.path.insert(0, str(ROOT / "backend" / "web_scraper"))
sys.path.insert(0, str(ROOT / "backend" / "lead_scraper"))
sys.path.insert(0, str(ROOT / "backend" / "lead_finder"))

from app import app


if __name__ == "__main__":
    app.run()
