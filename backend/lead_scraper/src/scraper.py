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


def _profile_sections(page, section_id: str) -> list[str]:
    try:
        section = page.locator(f"section:has(#{section_id}), #{section_id}").first
        if section.count() == 0:
            return []
        values = []
        items = section.locator("li.artdeco-list__item, li")
        for index in range(min(items.count(), 20)):
            text = " ".join((items.nth(index).inner_text(timeout=1500) or "").split())
            if text and text not in values:
                values.append(text)
        return values
    except Exception:
        return []


def _normalize_profile(row: dict[str, Any], page) -> dict[str, Any]:
    row["designation"] = row.get("current_role")
    row["company"] = row.get("current_company")
    row["full_name"] = row.get("name")
    row["profile_photo"] = row.get("photo")
    row["banner_photo"] = row.get("banner")
    row["linkedin_url"] = row.get("linkedin_profile_url") or row.get("url")
    row["experience"] = _profile_sections(page, "experience")
    row["education"] = _profile_sections(page, "education")
    print(f"[People Scraper] Name: {row.get('full_name')}")
    print(f"[People Scraper] Role: {row.get('designation')}")
    print(f"[People Scraper] Company: {row.get('company')}")
    print(f"[People Scraper] LinkedIn URL: {row.get('linkedin_url')}")
    return row


def _extract_with_retries(page, url: str) -> dict[str, Any]:
    row: dict[str, Any] = {}
    for attempt in range(3):
        row = extract_profile(page, url)
        if not row.get("error") or attempt == 2:
            return row
        time.sleep(1.5 * (attempt + 1))
    return row


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
                hit = _normalize_profile(hit, page)
                emit(index, f"Checking public contact pages {index + 1} of {total}", pct=start_pct)
                hit = enrich_profile(hit, hints=hints)
                results[index] = hit
                emit(index, f"Finished profile {index + 1} of {total}", hit)
            else:
                emit(index, f"Looking up profile {index + 1} of {total}", pct=start_pct)
                row = _extract_with_retries(page, url)
                row = _normalize_profile(row, page)
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
    finally:
        if browser is not None:
            browser.close()
        if playwright is not None:
            playwright.stop()

    return [row for row in results if isinstance(row, dict)]
