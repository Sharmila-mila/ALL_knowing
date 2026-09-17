#!/usr/bin/env python3
"""
Zuntra Lead Intelligence - Production Launcher
=============================================
Runs the production WSGI server (Waitress on Windows, Gunicorn/Waitress on Linux/macOS)
with proper thread pools, multi-worker setup, health checks, and security defaults.
"""

import sys
import os
import logging
import importlib.util
from pathlib import Path

# Configure production logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("zuntra-production")

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / "backend" / "ui"))
sys.path.insert(0, str(ROOT / "backend" / "web_scraper"))
sys.path.insert(0, str(ROOT / "backend" / "lead_scraper"))
sys.path.insert(0, str(ROOT / "backend" / "lead_finder"))

# Ensure outputs and storage directories exist before starting server
try:
    ws_paths = ROOT / "backend" / "web_scraper" / "src" / "paths.py"
    if ws_paths.exists():
        spec = importlib.util.spec_from_file_location("ws_paths", str(ws_paths))
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        mod.ensure_dirs()
        logger.info("Web scraper directories initialized.")
except Exception as e:
    logger.warning(f"Could not initialize web scraper dirs: {e}")

try:
    ls_config = ROOT / "backend" / "lead_scraper" / "src" / "config.py"
    if ls_config.exists():
        spec = importlib.util.spec_from_file_location("ls_config", str(ls_config))
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        mod.ensure_dirs()
        logger.info("Lead scraper directories initialized.")
except Exception as e:
    logger.warning(f"Could not initialize lead scraper dirs: {e}")


from app import app


def main():
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", "5000"))
    threads = int(os.environ.get("WAITRESS_THREADS", "8"))

    logger.info("Starting Zuntra Lead Intelligence Production Server...")
    logger.info(f"Binding address: http://{host}:{port}")

    # Use Waitress (cross-platform, highly reliable multi-threaded WSGI server)
    try:
        from waitress import serve
        logger.info(f"Serving via Waitress WSGI server ({threads} threads)...")
        print("\n=======================================================")
        print(" [OK] Zuntra Enterprise Intelligence Server Active!")
        print(f" [*] Local URL:  http://127.0.0.1:{port}")
        print(f" [*] Bind Host:  http://{host}:{port}")
        print("=======================================================\n")
        serve(app, host=host, port=port, threads=threads)
    except ImportError:
        logger.warning("Waitress not found, falling back to Flask runner...")
        app.run(host=host, port=port, debug=False, threaded=True)


if __name__ == "__main__":
    main()
