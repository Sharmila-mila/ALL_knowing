from __future__ import annotations

import json
import re
import sys
import time
from typing import Any
from urllib.parse import quote_plus, urlparse

from playwright.sync_api import Page

from src.auth import create_authenticated_context, open_playwright
from src.config import Settings, get_settings


def _canonical_company_url(value: Any) -> str | None:
    raw = str(value or "").strip().split("?")[0].rstrip("/")
    parsed = urlparse(raw)
    if parsed.scheme not in {"http", "https"} or parsed.netloc.lower() not in {"linkedin.com", "www.linkedin.com"}:
        return None
    match = re.fullmatch(r"/company/([^/#?]+)", parsed.path, re.I)
    if not match or match.group(1).lower() in {"unavailable", "search", "dir"}:
        return None
    return f"https://www.linkedin.com/company/{match.group(1)}/"


def _clean(value: Any) -> str | None:
    if value is None:
        return None
    text = re.sub(r"\s+", " ", str(value)).strip()
    return text or None


def _blank(url: str | None = None) -> dict[str, Any]:
    return {
        "company_name": None,
        "linkedin_url": url,
        "website": None,
        "company_logo": None,
        "followers": None,
        "employee_count": None,
        "company_size": None,
        "headquarters": None,
        "founded_year": None,
        "industry": None,
        "about": None,
        "specialties": [],
        "linkedin_followers": None,
        "linkedin_members": None,
        "error": None,
    }


def _find_company_url(page: Page, name: str) -> str | None:
    search_url = "https://www.linkedin.com/search/results/companies/?keywords=" + quote_plus(name)
    print(f"Company Search URL: {search_url}", flush=True)
    try:
        page.goto(search_url, timeout=60000)
        page.wait_for_load_state("networkidle", timeout=60000)
        result = page.locator("main a[href*='/company/']").first
        if result.count() == 0:
            result = page.locator("a[href*='/company/']").first
        if result.count() == 0:
            return None
        with page.expect_navigation(wait_until="networkidle", timeout=60000):
            result.click(timeout=15000)
        company_url = _canonical_company_url(page.url)
        print(f"Resolved Company URL: {company_url}", flush=True)
        return company_url
    except Exception:
        return None


def _extract(page: Page, url: str, requested_name: str) -> dict[str, Any]:
    result = _blank(url)
    meta = page.evaluate(
        """() => Object.fromEntries([...document.querySelectorAll('meta')]
          .filter(m => m.getAttribute('property') || m.getAttribute('name'))
          .map(m => [m.getAttribute('property') || m.getAttribute('name'), m.getAttribute('content') || '']))"""
    ) or {}
    body = page.locator("body").inner_text(timeout=10000)
    title = _clean(meta.get("og:title")) or _clean(page.title())
    if title and "|" in title:
        title = title.split("|")[0].strip()
    result["company_name"] = title or requested_name
    result["company_logo"] = _clean(meta.get("og:image"))
    result["about"] = _clean(meta.get("og:description"))

    website_link = page.locator("a[href^='http']").evaluate_all(
        """links => links.map(a => ({href: a.href, text: (a.innerText || a.textContent || '').trim()}))"""
    ) or []
    for link in website_link:
        href = str(link.get("href") or "").strip()
        text = str(link.get("text") or "").strip().lower()
        if href and "linkedin.com" not in href.lower() and (text == "website" or "website" in text):
            result["website"] = href.split("#", 1)[0].rstrip("/")
            break

    def text_after(*labels: str) -> str | None:
        for label in labels:
            match = re.search(rf"{re.escape(label)}\s*:?\s*([^\n]+)", body, re.I)
            if match:
                return _clean(match.group(1))
        return None

    followers = re.search(r"([\d,.]+\s*[kKmM]?\+?)\s+followers", body, re.I)
    employees = re.search(r"([\d,.]+\s*[kKmM]?\+?)\s+(?:employees|associated members|on LinkedIn)", body, re.I)
    result["followers"] = _clean(followers.group(1)) if followers else None
    result["employee_count"] = _clean(employees.group(1)) if employees else None
    result["linkedin_followers"] = result["followers"]
    result["linkedin_members"] = result["employee_count"]
    result["website"] = result.get("website") or text_after("Website")
    result["industry"] = text_after("Industry")
    result["company_size"] = text_after("Company size", "Company Size")
    result["headquarters"] = text_after("Headquarters")
    founded = text_after("Founded")
    founded_match = re.search(r"\b(18|19|20)\d{2}\b", founded or "")
    result["founded_year"] = founded_match.group(0) if founded_match else None
    specialties = text_after("Specialties")
    result["specialties"] = [item.strip() for item in re.split(r",|;|\|", specialties or "") if item.strip()]
    if not result["about"]:
        result["about"] = text_after("About")
    return result


def scrape_company(name: str, settings: Settings | None = None) -> dict[str, Any]:
    settings = settings or get_settings()
    last_error = "company_not_found"
    for attempt in range(3):
        playwright = None
        browser = None
        try:
            playwright = open_playwright()
            browser, context = create_authenticated_context(playwright, settings)
            page = context.new_page()
            canonical_url = _find_company_url(page, name)
            if not canonical_url:
                raise RuntimeError("linkedin_company_not_resolved")
            title = (page.title() or "").lower()
            if "page not found" in title or "sign in" in title or "/login" in page.url:
                raise RuntimeError("linkedin_company_not_resolved")
            result = _extract(page, canonical_url, name)
            result["linkedin_url"] = canonical_url
            if result.get("company_name"):
                print(f"Resolved Company LinkedIn: {canonical_url}", flush=True)
                print(f"[Company Scraper] Website: {result.get('website')}")
                print(f"[Company Scraper] Followers: {result.get('followers')}")
                print(f"[Company Scraper] Employees: {result.get('employee_count')}")
                print(f"[Company Scraper] Industry: {result.get('industry')}")
                return result
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
    result = _blank()
    result["error"] = last_error
    return result


if __name__ == "__main__":
    value = scrape_company(" ".join(sys.argv[1:]).strip())
    print(json.dumps(value, default=str))