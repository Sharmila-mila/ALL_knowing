from __future__ import annotations

import asyncio
import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from dotenv import load_dotenv

_ENV = Path(__file__).resolve().parent.parent.parent / "not to share" / ".env"
load_dotenv(_ENV if _ENV.exists() else None)

from src.adapters import SourceResult
from src.adapters.alpha_vantage import fetch_overview
from src.adapters.finnhub import domain_from_web, fetch_profile_metrics
from src.adapters.github import fetch_github
from src.adapters.gnews import fetch_gnews
from src.adapters.justdial import fetch_justdial
from src.adapters.linkedin_company import fetch_linkedin_company
from src.adapters.newsapi import fetch_newsapi
from src.adapters.nse import fetch_nse_announcements
from src.adapters.rss import fetch_rss
from src.adapters.sec_edgar import fetch_filings
from src.adapters.tracxn import fetch_tracxn
from src.adapters.trustpilot import fetch_trustpilot
from src.adapters.wikipedia import fetch_wikipedia
from src.adapters.yahoo import fetch_yahoo_quote, is_india_symbol
from src.adapters.zauba import fetch_zauba
from src.arrange_text import arrange_text
from src.cache import load_news_day, save_news_day
from src.http import HttpClient
from src.merge import _wiki_facts, is_english_article, merge_dossier, merge_news_articles
from src.news_enrich import enrich_articles, is_error_article, needs_content, pick_best_articles
from src.news_relevance import filter_relevant_articles
from src.paths import COMPANY_DIR, LASTRUN, RAW_DIR, company_key, ensure_dirs
from src.store import get_company, news_is_fresh, put_company, using_db
from src.rate_limit import RateLimits
from src.resolve import resolve_identity
import urllib.parse
import src.merge as _merge_mod
from src.schema import CompanyDossier, Executive as _Executive

_merge_mod.Executive = _Executive
_merge_mod.urllib = urllib


def _resolved_linkedin_company_url(payload: dict[str, Any], sources: dict[str, SourceResult]) -> str | None:
    source = sources.get("linkedin_company")
    source_data = source.data if source and source.ok and isinstance(source.data, dict) else {}
    candidates = (
        payload.get("linkedin_url"),
        (payload.get("overview") or {}).get("linkedin_url"),
        (payload.get("linkedin_insights") or {}).get("linkedin_url"),
        source_data.get("linkedin_url"),
    )
    for value in candidates:
        url = str(value or "").strip().split("?")[0].rstrip("/")
        if re.fullmatch(
            r"https://www\.linkedin\.com/company/(?!unavailable(?:/|$))[^/?#]+",
            url,
            re.I,
        ):
            match = re.search(r"/company/([^/?#]+)$", url, re.I)
            return f"https://www.linkedin.com/company/{match.group(1)}/" if match else None
    return None


async def _resolve_linkedin_company_url(company_name: str, expected_website: str | None = None) -> str | None:
    lead_scraper_dir = Path(__file__).resolve().parents[2] / "lead_scraper"
    script = (
        "import json,sys; from src.company_people import resolve_company_url; "
        "print(json.dumps(resolve_company_url(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None)))"
    )

    def invoke() -> str | None:
        try:
            process = subprocess.run(
                [sys.executable, "-c", script, company_name, expected_website or ""],
                capture_output=True,
                text=True,
                timeout=120,
                cwd=str(lead_scraper_dir),
                env=dict(os.environ),
            )
            lines = [line.strip() for line in process.stdout.splitlines() if line.strip()]
            if process.returncode != 0 or not lines:
                return None
            value = json.loads(lines[-1])
            return str(value).strip() if value else None
        except Exception:
            return None

    return await asyncio.to_thread(invoke)


async def _refresh_linkedin_people(company_name: str, linkedin_url: str | None) -> list[dict[str, Any]]:
    if not linkedin_url:
        return []
    lead_scraper_dir = Path(__file__).resolve().parents[2] / "lead_scraper"
    script = (
        "import json,sys; from src.company_people import get_company_people; "
        "print(json.dumps(get_company_people(sys.argv[1], sys.argv[2]), default=str))"
    )

    def invoke() -> list[dict[str, Any]]:
        try:
            process = subprocess.run(
                [sys.executable, "-c", script, company_name, linkedin_url],
                capture_output=True,
                text=True,
                timeout=180,
                cwd=str(lead_scraper_dir),
                env=dict(os.environ),
            )
            lines = [line.strip() for line in process.stdout.splitlines() if line.strip()]
            if process.returncode != 0 or not lines:
                return []
            value = json.loads(lines[-1])
            return value if isinstance(value, list) else []
        except Exception:
            return []

    return await asyncio.to_thread(invoke)


def _write_json(path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2, default=str), encoding="utf-8")


def _preserve_unresolved_company_fields(key: str, payload: dict[str, Any], linkedin_data: dict[str, Any]) -> dict[str, Any]:
    previous = get_company(key)
    if not isinstance(previous, dict):
        return payload
    old_overview = previous.get("overview") if isinstance(previous.get("overview"), dict) else {}
    overview = dict(payload.get("overview") or {})
    source_fields = {
        "website": linkedin_data.get("website"),
        "linkedin_followers": linkedin_data.get("linkedin_followers") or linkedin_data.get("followers"),
        "linkedin_members": linkedin_data.get("linkedin_members") or linkedin_data.get("employee_count"),
        "employee_count": linkedin_data.get("employee_count"),
        "description": linkedin_data.get("description"),
        "headquarters": linkedin_data.get("headquarters"),
        "industry": linkedin_data.get("industry"),
    }
    for field, scraped in source_fields.items():
        old = old_overview.get(field)
        if scraped in (None, "", []) and old not in (None, "", []):
            overview[field] = old
            if field == "website":
                resolved = dict(payload.get("resolved") or {})
                resolved["website"] = old
                payload["resolved"] = resolved
                payload["website"] = old
    if overview:
        payload = dict(payload)
        payload["overview"] = overview
    return payload


_progress_callback = None


def set_progress_callback(cb):
    global _progress_callback
    _progress_callback = cb


def _emit(pct: int, step: str):
    if _progress_callback:
        _progress_callback(pct, step)


async def run_pipeline(
    query: str,
    *,
    use_groq: bool = True,
    use_playwright: bool = True,
    skip_news: bool = False,
    lite: bool = False,
) -> CompanyDossier:
    if not using_db():
        ensure_dirs()
    key = company_key(query)
    lookback = int(os.getenv("NEWS_LOOKBACK_DAYS", "3"))
    generated_at = datetime.now(timezone.utc).isoformat()

    http = HttpClient()
    limits = RateLimits()
    sources: dict[str, SourceResult] = {}

    try:
        _emit(5, "Resolving company identity")
        ctx = await resolve_identity(http, limits, query)
        _emit(15, "Fetching financial profile")

        fh = await fetch_profile_metrics(http, limits, ctx)
        sources["finnhub"] = fh
        if fh.ok and isinstance(fh.data, dict):
            profile = fh.data.get("profile") or {}
            if profile.get("weburl"):
                ctx.website = profile.get("weburl")
                ctx.domain = domain_from_web(ctx.website)
            if profile.get("name"):
                ctx.name = profile.get("name")
            if profile.get("city") and not ctx.city:
                ctx.city = profile.get("city")
            if profile.get("country") and not ctx.country:
                ctx.country = profile.get("country")
            if profile.get("exchange"):
                ctx.exchanges = [profile.get("exchange")]

        _emit(20, "Fetching market data")
        yh = await fetch_yahoo_quote(http, ctx)
        sources["yahoo"] = yh
        if yh.ok and isinstance(yh.data, dict):
            used = yh.data.get("symbol")
            if used:
                ctx.ticker = used
            quote = yh.data.get("quote") or {}
            price = quote.get("price") or {}
            profile = quote.get("summaryProfile") or {}
            if price.get("exchangeName"):
                ctx.exchanges = list(dict.fromkeys((ctx.exchanges or []) + [price.get("exchangeName")]))
            if profile.get("website") and not ctx.website:
                ctx.website = profile.get("website")
                ctx.domain = domain_from_web(ctx.website)
            if profile.get("city") and not ctx.city:
                ctx.city = profile.get("city")
            if profile.get("country") and not ctx.country:
                ctx.country = profile.get("country")
            if price.get("longName"):
                ctx.name = price.get("longName")

        async def _step(coro, pct: int, step: str):
            result = await coro
            _emit(pct, step)
            return result

        _emit(25, "Fetching public records")
        india = is_india_symbol(ctx.ticker)
        if lite:
            wiki = await fetch_wikipedia(http, ctx)
            if india:
                sec = SourceResult("sec_edgar", False, error="india_listing")
                nse = await fetch_nse_announcements(http, ctx)
            else:
                sec = await fetch_filings(http, limits, ctx)
                nse = SourceResult("nse", False, error="us_listing")
            gh = SourceResult("github", False, error="skipped_lite")
            rss = SourceResult("rss", False, error="skipped_lite")
            av = await fetch_overview(http, limits, ctx)
        else:
            if india:
                wiki, nse, gh, rss, av = await asyncio.gather(
                    _step(fetch_wikipedia(http, ctx), 32, "Fetching public records"),
                    _step(fetch_nse_announcements(http, ctx), 36, "Fetching filings"),
                    _step(fetch_github(http, ctx), 40, "Fetching GitHub"),
                    _step(fetch_rss(http, ctx), 42, "Fetching RSS"),
                    _step(fetch_overview(http, limits, ctx), 50, "Fetching market data"),
                )
                sec = SourceResult("sec_edgar", False, error="india_listing")
            else:
                wiki, sec, nse, gh, rss, av = await asyncio.gather(
                    _step(fetch_wikipedia(http, ctx), 32, "Fetching public records"),
                    _step(fetch_filings(http, limits, ctx), 36, "Fetching filings"),
                    _step(fetch_nse_announcements(http, ctx), 38, "Fetching NSE filings"),
                    _step(fetch_github(http, ctx), 40, "Fetching GitHub"),
                    _step(fetch_rss(http, ctx), 42, "Fetching RSS"),
                    _step(fetch_overview(http, limits, ctx), 50, "Fetching market data"),
                )
        sources["wikipedia"] = wiki
        sources["sec_edgar"] = sec
        sources["nse"] = nse
        sources["github"] = gh
        sources["rss"] = rss
        sources["alpha_vantage"] = av

        if wiki.ok and isinstance(wiki.data, dict):
            if wiki.data.get("title"):
                ctx.wiki_title = wiki.data.get("title")
            summary = wiki.data.get("summary") or {}
            facts = _wiki_facts(summary.get("extract"), summary.get("description"))
            if facts.get("city") and not ctx.city:
                ctx.city = facts["city"]
            if facts.get("country") and not ctx.country:
                ctx.country = facts["country"]
        if av.ok and isinstance(av.data, dict):
            if av.data.get("Website") and not ctx.website:
                ctx.website = av.data.get("Website")
                ctx.domain = domain_from_web(ctx.website)
            if av.data.get("Name"):
                ctx.name = av.data.get("Name")
            if av.data.get("Country") and not ctx.country:
                ctx.country = av.data.get("Country")

        _emit(52, "Enriching company records")
        resolved_linkedin_url = await _resolve_linkedin_company_url(ctx.name or query, ctx.website)
        print(f"Resolved LinkedIn: {resolved_linkedin_url}", flush=True)
        people = await _refresh_linkedin_people(ctx.name or query, resolved_linkedin_url) if use_playwright else []
        executive_re = re.compile(r"\b(ceo|chief executive|founder|managing director)\b", re.I)
        ceo = next(
            (
                row.get("full_name")
                for row in people
                if executive_re.search(str(row.get("designation") or row.get("headline") or ""))
            ),
            None,
        )
        print(f"CEO: {ceo}", flush=True)
        print(f"LinkedIn people refreshed: {len(people)}", flush=True)
        if lite:
            tracxn = SourceResult("tracxn", False, error="skipped_lite")
            justdial = SourceResult("justdial", False, error="skipped_lite")
            trustpilot = SourceResult("trustpilot", False, error="skipped_lite")
            zauba, linkedin_comp = await asyncio.gather(
                fetch_zauba(http, ctx),
                fetch_linkedin_company(http, limits, ctx),
            )
        else:
            tracxn, zauba, justdial, trustpilot, linkedin_comp = await asyncio.gather(
                fetch_tracxn(http, ctx),
                fetch_zauba(http, ctx),
                fetch_justdial(http, ctx),
                fetch_trustpilot(http, ctx),
                fetch_linkedin_company(http, limits, ctx),
            )
        sources["tracxn"] = tracxn
        sources["zauba"] = zauba
        sources["justdial"] = justdial
        sources["trustpilot"] = trustpilot
        linkedin_data = dict(linkedin_comp.data) if isinstance(linkedin_comp.data, dict) else {}
        linkedin_data["linkedin_url"] = resolved_linkedin_url
        linkedin_comp = SourceResult(
            "linkedin_company",
            bool(resolved_linkedin_url) or linkedin_comp.ok,
            data=linkedin_data,
            error=linkedin_comp.error if not resolved_linkedin_url else None,
        )
        sources["linkedin_company"] = linkedin_comp

        _emit(55, "Fetching news articles")
        articles: list[dict[str, Any]] = []
        company_label = ctx.name or query
        if lite or skip_news:
            sources["newsapi"] = SourceResult("newsapi", False, error="skipped")
            sources["gnews"] = SourceResult("gnews", False, error="skipped")
        else:
            news_cached = load_news_day(key)
            if news_cached and isinstance(news_cached.get("articles"), list) and news_cached["articles"]:
                cached = [a for a in news_cached["articles"] if is_english_article(a)]
                sources["newsapi"] = SourceResult("newsapi", True, data={"cached": True})
                sources["gnews"] = SourceResult("gnews", True, data={"cached": True})
                if use_playwright and needs_content(cached):
                    relevant = filter_relevant_articles(
                        cached,
                        company_name=company_label,
                        ticker=ctx.ticker,
                        query=query,
                        limit=8,
                        use_groq=use_groq,
                    )
                    _emit(70, "Opening articles")
                    enriched = await enrich_articles(relevant, top_n=8, enabled=True)
                    articles = pick_best_articles(
                        [a for a in enriched if is_english_article(a) and not is_error_article(a)],
                        limit=8,
                    )
                else:
                    articles = pick_best_articles(cached, limit=8)
                save_news_day(
                    key,
                    {
                        "query": query,
                        "lookback_days": lookback,
                        "articles": articles,
                        "fetched_at": generated_at,
                    },
                )
            else:
                n_api, n_g = await asyncio.gather(
                    fetch_newsapi(http, ctx, lookback),
                    fetch_gnews(http, ctx, lookback),
                )
                sources["newsapi"] = n_api
                sources["gnews"] = n_g
                batches = []
                if n_api.ok and isinstance(n_api.data, dict):
                    batches.append(n_api.data.get("articles") or [])
                if n_g.ok and isinstance(n_g.data, dict):
                    batches.append(n_g.data.get("articles") or [])
                candidates = merge_news_articles(batches, limit=30)
                relevant = filter_relevant_articles(
                    candidates,
                    company_name=company_label,
                    ticker=ctx.ticker,
                    query=query,
                    limit=8,
                    use_groq=use_groq,
                )
                _emit(70, "Opening articles")
                enriched = await enrich_articles(relevant, top_n=8, enabled=use_playwright)
                articles = pick_best_articles(
                    [a for a in enriched if is_english_article(a) and not is_error_article(a)],
                    limit=8,
                )
                save_news_day(
                    key,
                    {
                        "query": query,
                        "lookback_days": lookback,
                        "articles": articles,
                        "fetched_at": generated_at,
                    },
                )

        _emit(80, "Building company dossier")
        raw_path = RAW_DIR / f"{key}.json"
        raw_bundle = {
            "query": query,
            "resolved": {
                "ticker": ctx.ticker,
                "cik": ctx.cik,
                "name": ctx.name,
                "website": ctx.website,
                "wiki_title": ctx.wiki_title,
                "domain": ctx.domain,
            },
            "sources": {
                name: {"ok": sr.ok, "error": sr.error, "data": sr.data}
                for name, sr in sources.items()
            },
            "news_articles": articles,
            "fetched_at": generated_at,
        }
        if not using_db():
            _write_json(raw_path, raw_bundle)

        _emit(90, "Merging and saving results")
        company_path = COMPANY_DIR / f"{key}.json"
        prev_news = None
        if lite or skip_news:
            prev = get_company(key)
            if prev and isinstance(prev.get("news"), dict) and prev["news"].get("articles"):
                if news_is_fresh(prev["news"].get("fetched_at") or ((prev.get("meta") or {}).get("generated_at"))):
                    prev_news = prev["news"]
        dossier = merge_dossier(
            query,
            ctx,
            sources,
            news_articles=articles,
            lookback_days=lookback,
            generated_at=generated_at,
            raw_path=str(raw_path),
            company_path=str(company_path),
        )

        if use_groq:
            dossier = arrange_text(dossier)

        _emit(95, "Validating data")
        dossier = CompanyDossier.model_validate(dossier.model_dump())
        payload = dossier.model_dump()
        payload["linkedin_url"] = _resolved_linkedin_company_url(payload, sources)
        payload = _preserve_unresolved_company_fields(key, payload, linkedin_data)
        overview = payload.get("overview") if isinstance(payload.get("overview"), dict) else {}
        print(f"Company: {ctx.name or query}", flush=True)
        print(f"Resolved Website: {ctx.website}", flush=True)
        print(f"Followers: {overview.get('linkedin_followers')}", flush=True)
        print(f"Employees: {overview.get('employee_count')}", flush=True)
        print(f'dossier["linkedin_url"] -> {payload["linkedin_url"]}', flush=True)
        if lite or skip_news:
            save_payload = dict(payload)
            if prev_news:
                save_payload["news"] = prev_news
            payload["news"] = {"digest_summary": None, "lookback_days": lookback, "articles": []}
            put_company(key, save_payload)
            if not using_db():
                _write_json(LASTRUN, save_payload)
            _emit(100, "Complete")
            return CompanyDossier.model_validate(payload)
        put_company(key, payload)
        if not using_db():
            _write_json(LASTRUN, payload)
        _emit(100, "Complete")
        return dossier
    finally:
        await http.aclose()


async def fetch_company_news(
    query: str,
    *,
    use_groq: bool = True,
    use_playwright: bool = True,
) -> dict[str, Any]:
    if not using_db():
        ensure_dirs()
    lookback = int(os.getenv("NEWS_LOOKBACK_DAYS", "3"))
    http = HttpClient()
    limits = RateLimits()
    try:
        ctx = await resolve_identity(http, limits, query)
        company_label = ctx.name or query
        n_api, n_g = await asyncio.gather(
            fetch_newsapi(http, ctx, lookback),
            fetch_gnews(http, ctx, lookback),
        )
        batches = []
        if n_api.ok and isinstance(n_api.data, dict):
            batches.append(n_api.data.get("articles") or [])
        if n_g.ok and isinstance(n_g.data, dict):
            batches.append(n_g.data.get("articles") or [])
        candidates = merge_news_articles(batches, limit=30)
        relevant = filter_relevant_articles(
            candidates,
            company_name=company_label,
            ticker=ctx.ticker,
            query=query,
            limit=8,
            use_groq=use_groq,
        )
        enriched = await enrich_articles(relevant, top_n=8, enabled=use_playwright)
        articles = pick_best_articles(
            [a for a in enriched if is_english_article(a) and not is_error_article(a)],
            limit=8,
        )
        generated_at = datetime.now(timezone.utc).isoformat()
        save_news_day(
            company_key(query),
            {
                "query": query,
                "lookback_days": lookback,
                "articles": articles,
                "fetched_at": generated_at,
            },
        )
        return {
            "query": query,
            "name": company_label,
            "ticker": ctx.ticker,
            "articles": articles,
            "lookback_days": lookback,
            "fetched_at": generated_at,
        }
    finally:
        await http.aclose()
