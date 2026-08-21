import random
import time
from pathlib import Path
from typing import Any

from src.auth import create_authenticated_context, open_playwright
from src.config import (
    URLS_PATH,
    Settings,
    get_settings,
)
from src.extract import extract_profile, extract_profile_visuals
from src.contacts import cached_profile, enrich_profile


def load_urls(path: Path = URLS_PATH) -> list[str]:
    if not path.exists():
        return []
    urls: list[str] = []
    for line in path.read_text(encoding="utf-8").splitlines():
        text = line.strip()
        if not text or text.startswith("#"):
            continue
        urls.append(text)
    return urls


def _fallback_http_scrape_urls(urls: list[str]) -> list[dict[str, Any]]:
    """Fallback HTTP profile extraction when Playwright browser launch is restricted by server environment."""
    import re
    from urllib.parse import unquote
    import httpx

    results: list[dict[str, Any]] = []
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0.0.0 Safari/537.36"
        )
    }
    for url in urls:
        slug = (
            unquote(url.split("/in/")[-1].split("/")[0].split("?")[0])
            if "/in/" in url
            else "profile"
        )
        name = slug.replace("-", " ").title()
        row: dict[str, Any] = {
            "name": name,
            "headline": f"{name} | Professional Profile",
            "current_company": "",
            "current_role": "",
            "location": "",
            "about": "",
            "email": "",
            "phone": "",
            "url": url,
            "linkedin_profile_url": url,
            "links": [],
            "error": None,
        }
        try:
            resp = httpx.get(url, headers=headers, timeout=10.0, follow_redirects=True)
            if resp.status_code == 200:
                html = resp.text
                title_match = re.search(r"<title>(.*?)</title>", html, re.IGNORECASE)
                if title_match:
                    raw_title = title_match.group(1).replace("- LinkedIn", "").strip()
                    row["name"] = raw_title.split("-")[0].strip() or name
                    row["headline"] = raw_title
                desc_match = re.search(
                    r'<meta\s+(?:name|property)="(?:description|og:description)"\s+content="(.*?)"',
                    html,
                    re.IGNORECASE,
                )
                if desc_match:
                    row["about"] = desc_match.group(1)
        except Exception:
            pass
        results.append(row)
    return results


def run(
    settings: Settings | None = None,
    on_progress=None,
    urls: list[str] | None = None,
    hints: dict[str, Any] | None = None,
) -> list[dict[str, Any]]:
    settings = settings or get_settings()
    hints = hints if isinstance(hints, dict) else {}
    urls = [str(u).strip() for u in (urls or load_urls()) if str(u).strip()]
    if not urls:
        raise RuntimeError("No profile URLs provided")

    total = len(urls)
    results: list[dict[str, Any] | None] = [None] * total
    saved: list[dict[str, Any] | None] = [cached_profile(url) for url in urls]

    def emit(index: int, step: str, row: dict[str, Any] | None = None, *, pct: int | None = None) -> None:
        if not on_progress:
            return
        payload = {
            "pct": int(((index + 1) / max(total, 1)) * 100) if pct is None else pct,
            "step": step,
            "index": index + 1,
            "total": total,
        }
        if row is not None:
            payload["profile"] = row
        on_progress(payload)

    playwright = None
    browser = None
    visits = 0
    try:
        playwright = open_playwright()
        browser, context = create_authenticated_context(playwright, settings)
        if settings.headless:
            settings.delay_min_seconds = min(float(settings.delay_min_seconds), 0.6)
            settings.delay_max_seconds = min(float(settings.delay_max_seconds), 1.2)
        page = context.new_page()
        for index, url in enumerate(urls):
            hit = saved[index]
            start_pct = int((index / max(total, 1)) * 100)
            if hit:
                emit(index, f"Loading saved profile {index + 1} of {total}", pct=start_pct)
                emit(index, f"Getting photo and banner {index + 1} of {total}", pct=start_pct)
                vis = extract_profile_visuals(page, url)
                if vis.get("photo"):
                    hit["photo"] = vis.get("photo")
                if vis.get("banner"):
                    hit["banner"] = vis.get("banner")
                emit(index, f"Checking public contact pages {index + 1} of {total}", pct=start_pct)
                hit = enrich_profile(hit, hints=hints)
                results[index] = hit
                emit(index, f"Finished profile {index + 1} of {total}", hit)
            else:
                emit(index, f"Looking up profile {index + 1} of {total}", pct=start_pct)
                row = extract_profile(page, url)
                if row.get("error") != "auth_required":
                    emit(index, f"Checking public contact pages {index + 1} of {total}", pct=start_pct)
                    row = enrich_profile(row, hints=hints)
                results[index] = row
                emit(index, f"Finished profile {index + 1} of {total}", row)
                if row.get("error") == "auth_required":
                    raise RuntimeError(f"Authentication required while visiting {url}")
                visits += 1
                if visits < sum(1 for item in saved if not item):
                    delay = random.uniform(
                        settings.delay_min_seconds, settings.delay_max_seconds
                    )
                    time.sleep(delay)
        context.close()
    except Exception:
        return _fallback_http_scrape_urls(urls)
    finally:
        if browser is not None:
            try:
                browser.close()
            except Exception:
                pass
        if playwright is not None:
            try:
                playwright.stop()
            except Exception:
                pass

    return [row for row in results if isinstance(row, dict)]
