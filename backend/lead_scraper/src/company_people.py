from __future__ import annotations

import json
import re
import sys
import time
from typing import Any
from urllib.parse import quote_plus, urljoin, urlparse

from playwright.sync_api import Page

from src.auth import create_authenticated_context, open_playwright
from src.config import Settings, get_settings
from src.contacts import _web_src


def _clean(value: Any) -> str | None:
    text = re.sub(r"\s+", " ", str(value or "")).strip()
    return text or None


def _canonical_profile_url(value: Any) -> str | None:
    raw = str(value or "").strip().split("?")[0].rstrip("/")
    parsed = urlparse(raw)
    if parsed.scheme not in {"http", "https"} or parsed.netloc.lower() not in {"linkedin.com", "www.linkedin.com"}:
        return None
    match = re.fullmatch(r"/in/([^/#?]+)", parsed.path, re.I)
    if not match:
        return None
    return f"https://www.linkedin.com/in/{match.group(1)}"


def _canonical_company_url(value: Any) -> str | None:
    raw = str(value or "").strip().split("?")[0].rstrip("/")
    parsed = urlparse(raw)
    if parsed.scheme not in {"http", "https"} or parsed.netloc.lower() not in {"linkedin.com", "www.linkedin.com"}:
        return None
    match = re.fullmatch(r"/company/([^/#?]+)", parsed.path, re.I)
    if not match or match.group(1).lower() in {"unavailable", "search", "dir"}:
        return None
    return f"https://www.linkedin.com/company/{match.group(1)}/"


def resolve_company_url(
    company_name: str,
    expected_website: str | None = None,
    settings: Settings | None = None,
) -> str | None:
    """Resolve a company URL by clicking LinkedIn's first company result."""
    settings = settings or get_settings()
    search_url = "https://www.linkedin.com/search/results/companies/?keywords=" + quote_plus(company_name)
    print(f"Company: {company_name}", flush=True)
    print(f"Search URL: {search_url}", flush=True)
    playwright = None
    browser = None
    try:
        playwright = open_playwright()
        browser, context = create_authenticated_context(playwright, settings)
        page = context.new_page()
        page.goto(search_url, timeout=60000)
        page.wait_for_load_state("networkidle", timeout=60000)
        links = page.locator("main a[href*='/company/']")
        if links.count() == 0:
            links = page.locator("a[href*='/company/']")
        expected_domain = re.sub(r"^www\.", "", urlparse(expected_website or "").netloc.lower())
        for index in range(min(links.count(), 10)):
            page.goto(search_url, timeout=60000)
            page.wait_for_load_state("networkidle", timeout=60000)
            links = page.locator("main a[href*='/company/']")
            if links.count() == 0:
                links = page.locator("a[href*='/company/']")
            result = links.nth(index)
            if result.count() == 0:
                break
            with page.expect_navigation(wait_until="networkidle", timeout=60000):
                result.click(timeout=15000)
            resolved = _canonical_company_url(page.url)
            if not resolved:
                continue
            if expected_domain:
                body = page.locator("body").inner_text(timeout=10000).lower()
                if expected_domain not in body:
                    continue
            print(f"Resolved LinkedIn: {resolved}", flush=True)
            return resolved
        print("Resolved LinkedIn: None", flush=True)
        return None
    except Exception:
        print("Resolved LinkedIn: None", flush=True)
        return None
    finally:
        if browser is not None:
            browser.close()
        if playwright is not None:
            playwright.stop()


def _resolve_people_url(page: Page, company_name: str, company_url: str | None) -> str | None:
    canonical_company = _canonical_company_url(company_url)
    if canonical_company:
        return canonical_company.rstrip("/") + "/people/"
    try:
        page.goto(
            "https://www.linkedin.com/search/results/companies/?keywords=" + quote_plus(company_name),
            timeout=60000,
        )
        page.wait_for_load_state("networkidle", timeout=60000)
        result = page.locator("main a[href*='/company/']").first
        if result.count() == 0:
            result = page.locator("a[href*='/company/']").first
        if result.count() == 0:
            return None
        with page.expect_navigation(wait_until="networkidle", timeout=60000):
            result.click(timeout=15000)
        canonical_company = _canonical_company_url(page.url)
        if canonical_company:
            return canonical_company.rstrip("/") + "/people/"
    except Exception:
        pass
    return None


def _collect_visible_cards(page: Page, company_name: str) -> list[dict[str, Any]]:
    script = """
    ({limit}) => {
      const output = [];
      const seen = new Set();
            const links = [...document.querySelectorAll('main a[href*="/in/"], a[href*="/in/"]')];
      for (const link of links) {
                const href = (link.href || '').split('?')[0].replace(/\/$/, '');
        if (!href || seen.has(href) || !/linkedin\.com\/in\//i.test(href)) continue;
                const card = link.closest('li.reusable-search__result-container, li.entity-result, li') || link.closest('[data-view-name]') || link.parentElement?.parentElement;
        if (!card) continue;
        const lines = (card.innerText || '').split('\n').map(x => x.trim()).filter(Boolean);
                const nameNode = card.querySelector('.entity-result__title-text span[aria-hidden="true"], .artdeco-entity-lockup__title span[aria-hidden="true"]');
                const name = (nameNode?.innerText || link.innerText || '').trim() || lines[0] || '';
        if (!name || name.length > 100) continue;
                const image = card.querySelector('.entity-result__image img, .ivm-image-view-model img, img');
                const designationNode = card.querySelector('.entity-result__primary-subtitle, .artdeco-entity-lockup__subtitle, [class*="primary-subtitle"]');
                const locationNode = card.querySelector('.entity-result__secondary-subtitle, .artdeco-entity-lockup__caption, [class*="secondary-subtitle"]');
                const designation = (designationNode?.innerText || lines[1] || '').trim() || null;
                const location = (locationNode?.innerText || lines[2] || '').trim() || null;
        const profileId = href.split('/in/')[1] || '';
        seen.add(href);
        output.push({
          full_name: name,
                    designation,
          department: null,
          company: null,
          linkedin_url: href,
          profile_photo: image?.currentSrc || image?.src || null,
                    location,
                    headline: [designation, location].filter(Boolean).join(' | ') || null,
          profile_id: profileId,
        });
                if (output.length >= limit) break;
      }
      return output;
    }
    """
    rows = page.evaluate(script, {"limit": 50}) or []
    result = []
    for row in rows:
        if not isinstance(row, dict):
            continue
        row["company"] = company_name
        for key in ("full_name", "designation", "department", "company", "linkedin_url", "profile_photo", "location", "headline", "profile_id"):
            row.setdefault(key, None)
        result.append(row)
    return result


def _persist(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    with _web_src():
        from src.store import upsert_person

        saved = []
        for row in rows:
            url = _canonical_profile_url(row.get("linkedin_url"))
            if not url:
                continue
            row["linkedin_url"] = url
            print(f"Resolved Employee: {row.get('full_name')}", flush=True)
            print(url, flush=True)
            profile = {
                "full_name": row.get("full_name"),
                "name": row.get("full_name"),
                "headline": row.get("headline"),
                "designation": row.get("designation"),
                "current_role": row.get("designation"),
                "department": row.get("department"),
                "current_company": row.get("company"),
                "location": row.get("location"),
                "profile_id": row.get("profile_id"),
                "profile_photo": row.get("profile_photo"),
            }
            stored = upsert_person({
                "linkedin_url": url,
                "name": row.get("full_name"),
                "company": row.get("company"),
                "email": row.get("work_email"),
                "phone": row.get("phone"),
                "profile": profile,
            })
            row["key"] = stored.get("key")
            saved.append(row)
        return saved


def get_company_people(
    company_name: str,
    linkedin_company_url: str | None = None,
    settings: Settings | None = None,
) -> list[dict[str, Any]]:
    settings = settings or get_settings()
    last_error = "company_people_not_found"
    for attempt in range(3):
        playwright = None
        browser = None
        try:
            playwright = open_playwright()
            browser, context = create_authenticated_context(playwright, settings)
            page = context.new_page()
            target = _resolve_people_url(page, company_name, linkedin_company_url)
            candidates = [target] if target else []
            rows: list[dict[str, Any]] = []
            for url in candidates:
                if not url:
                    continue
                try:
                    page.goto(url, wait_until="domcontentloaded", timeout=60000)
                    page.wait_for_timeout(2200)
                    stagnant = 0
                    previous = 0
                    for _ in range(12):
                        rows = _collect_visible_cards(page, company_name)
                        if len(rows) >= 50:
                            break
                        page.mouse.wheel(0, 1800)
                        page.wait_for_timeout(1200)
                        if len(rows) == previous:
                            stagnant += 1
                        else:
                            stagnant = 0
                        previous = len(rows)
                        if stagnant >= 2:
                            break
                    if rows:
                        canonical_rows: list[dict[str, Any]] = []
                        for row in rows[:50]:
                            profile_url = _canonical_profile_url(row.get("linkedin_url"))
                            if not profile_url:
                                continue
                            try:
                                page.goto(profile_url, wait_until="domcontentloaded", timeout=45000)
                                canonical = _canonical_profile_url(page.url)
                            except Exception:
                                canonical = None
                            if canonical:
                                row["linkedin_url"] = canonical
                                row["profile_id"] = canonical.rsplit("/", 1)[-1]
                                canonical_rows.append(row)
                        rows = canonical_rows
                    if rows:
                        return _persist(rows[:50])
                except Exception as exc:
                    last_error = str(exc)
            raise RuntimeError(last_error)
        except Exception as exc:
            last_error = str(exc)
            if attempt < 2:
                time.sleep(1.5 * (attempt + 1))
        finally:
            if browser is not None:
                browser.close()
            if playwright is not None:
                playwright.stop()
    return []


if __name__ == "__main__":
    company = sys.argv[1] if len(sys.argv) > 1 else ""
    url = sys.argv[2] if len(sys.argv) > 2 else ""
    print(json.dumps(get_company_people(company, url or None), default=str))