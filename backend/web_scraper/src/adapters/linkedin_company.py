from __future__ import annotations

import asyncio
import json
import re
import subprocess
import sys
import urllib.parse
from typing import Any

from src.adapters import CompanyContext, SourceResult
from src.cache import get_cached, set_cached
from src.http import HttpClient, sanitize_error
from src.rate_limit import RateLimits


async def fetch_linkedin_company(
    http: HttpClient,
    limits: RateLimits,
    ctx: CompanyContext,
) -> SourceResult:
    cache_key = "playwright-v3:" + (ctx.domain or ctx.name or ctx.query or "").lower().strip()
    if not cache_key:
        return SourceResult("linkedin_company", False, error="no_query")

    cached = get_cached("linkedin_company", cache_key, 7 * 86400)
    cached_url = str((cached or {}).get("linkedin_url") or "") if isinstance(cached, dict) else ""
    if cached is not None and isinstance(cached, dict) and re.fullmatch(
        r"https://www\.linkedin\.com/company/(?!unavailable(?:/|$))[^/?#]+/?",
        cached_url,
        re.I,
    ):
        return SourceResult("linkedin_company", True, data=cached)

    try:
        query = ctx.name or ctx.query or cache_key
        print(
            f"Company Search URL: https://www.linkedin.com/search/results/companies/?keywords={urllib.parse.quote_plus(query)}",
            flush=True,
        )
        li_root = __import__("pathlib").Path(__file__).resolve().parents[3] / "lead_scraper"
        script = "import json,sys; from src.company_scraper import scrape_company; print(json.dumps(scrape_company(sys.argv[1]), default=str))"

        def invoke() -> dict[str, Any]:
            proc = subprocess.run(
                [sys.executable, "-c", script, query],
                capture_output=True,
                text=True,
                timeout=180,
                cwd=str(li_root),
                env=dict(__import__("os").environ),
            )
            lines = [line.strip() for line in proc.stdout.splitlines() if line.strip()]
            if proc.returncode != 0 or not lines:
                raise RuntimeError((proc.stderr or "company_scraper_failed").strip()[-500:])
            value = json.loads(lines[-1])
            if not isinstance(value, dict):
                raise RuntimeError("company_scraper_invalid_result")
            return value

        scraped = await asyncio.to_thread(invoke)
        if scraped.get("error"):
            return SourceResult("linkedin_company", False, error=str(scraped["error"]))
        print(f"Resolved Company URL: {scraped.get('linkedin_url')}", flush=True)
        # Identity and official website come from the existing resolver/API pipeline.
        # LinkedIn contributes only LinkedIn-specific enrichment here.
        matched_data = {
            "linkedin_url": scraped.get("linkedin_url"),
            "company_logo": scraped.get("company_logo"),
            "website": scraped.get("website"),
            "name": ctx.name,
            "industry": scraped.get("industry"),
            "founded_year": scraped.get("founded_year"),
            "headquarters": scraped.get("headquarters"),
            "employee_count": scraped.get("employee_count"),
            "linkedin_followers": scraped.get("linkedin_followers") or scraped.get("followers"),
            "linkedin_members": scraped.get("linkedin_members") or scraped.get("employee_count"),
            "company_size": scraped.get("company_size"),
            "description": scraped.get("about"),
            "specialties": scraped.get("specialties") or [],
        }
        print(f"Stored Company URL: {matched_data.get('linkedin_url')}", flush=True)
        set_cached("linkedin_company", cache_key, matched_data)
        return SourceResult("linkedin_company", True, data=matched_data)
    except Exception as exc:
        return SourceResult("linkedin_company", False, error=sanitize_error(exc))
