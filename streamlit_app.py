import asyncio
import json
import os
import sys
from contextlib import contextmanager
from datetime import datetime
from pathlib import Path

import pandas as pd
import streamlit as st
from dotenv import load_dotenv

# Set page configuration as first Streamlit command
st.set_page_config(
    page_title="ALL_knowing — Lead & Company Intelligence Platform",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded",
)

ROOT = Path(__file__).resolve().parent

import subprocess

# Auto-ensure Playwright Chromium is installed for Streamlit Cloud
def _ensure_playwright_chromium():
    try:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            p.chromium.launch(headless=True).close()
    except Exception as exc:
        err = str(exc).lower()
        if "executable" in err or "installed" in err or "chromium" in err or "browser" in err:
            try:
                subprocess.run([sys.executable, "-m", "playwright", "install", "chromium"], check=False)
            except Exception:
                pass

_ensure_playwright_chromium()



@contextmanager
def backend_context(module_folder_name: str):
    """Context manager to dynamically swap sys.path and handle src namespace collisions."""
    target_dir = str(ROOT / module_folder_name)
    cached_src = {
        k: sys.modules.pop(k)
        for k in list(sys.modules)
        if k == "src" or k.startswith("src.")
    }
    for folder in ["lead finder", "lead scraper", "web scraper"]:
        p = str(ROOT / folder)
        if p in sys.path:
            sys.path.remove(p)
    sys.path.insert(0, target_dir)
    try:
        yield
    finally:
        for k in list(sys.modules):
            if k == "src" or k.startswith("src."):
                sys.modules.pop(k, None)
        sys.modules.update(cached_src)
        if target_dir in sys.path:
            sys.path.remove(target_dir)


def data_to_csv(data: list[dict] | dict) -> str:
    """Helper to convert dictionary or list of dictionaries into CSV string."""
    if isinstance(data, dict):
        data = [data]
    if not data:
        return ""
    df = pd.DataFrame(data)
    return df.to_csv(index=False)


# Modern Glassmorphic CSS Theme Injection
st.markdown(
    """
    <style>
    /* Main Background & Typography */
    .stApp {
        background-color: #0F172A;
        color: #F8FAFC;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    
    /* Header Styling */
    .app-header {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%);
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(12px);
        padding: 24px 32px;
        border-radius: 16px;
        margin-bottom: 24px;
    }
    .app-title {
        font-size: 2.2rem;
        font-weight: 800;
        background: linear-gradient(90deg, #818CF8, #C084FC);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0 0 8px 0;
    }
    .app-subtitle {
        color: #94A3B8;
        font-size: 1.05rem;
        margin: 0;
    }
    
    /* Cards & Container Glassmorphism */
    div[data-testid="stExpander"], div[data-testid="stMetric"], .glass-card {
        background: rgba(30, 41, 59, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        backdrop-filter: blur(8px);
        padding: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
    
    /* Metric Card Customization */
    div[data-testid="stMetricValue"] {
        color: #6366F1 !important;
        font-weight: 700;
    }
    
    /* Buttons */
    .stButton > button {
        background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
        color: #FFFFFF;
        font-weight: 600;
        border: none;
        border-radius: 8px;
        padding: 10px 24px;
        transition: all 0.2s ease-in-out;
        box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
    }
    .stButton > button:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6);
        background: linear-gradient(135deg, #4F46E5 0%, #4338CA 100%);
    }
    
    /* Sidebar Styling */
    section[data-testid="stSidebar"] {
        background-color: #1E293B;
        border-right: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    /* Tables & Dataframes */
    .stDataFrame {
        border-radius: 10px;
        overflow: hidden;
    }
    
    /* Badges */
    .badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 9999px;
        font-size: 0.8rem;
        font-weight: 600;
        margin-right: 6px;
    }
    .badge-success { background-color: rgba(34, 197, 94, 0.2); color: #4ADE80; border: 1px solid rgba(34, 197, 94, 0.3); }
    .badge-warning { background-color: rgba(234, 179, 8, 0.2); color: #FACC15; border: 1px solid rgba(234, 179, 8, 0.3); }
    .badge-info { background-color: rgba(59, 130, 246, 0.2); color: #60A5FA; border: 1px solid rgba(59, 130, 246, 0.3); }
    </style>
    """,
    unsafe_allow_html=True,
)

# Sidebar Navigation
with st.sidebar:
    st.image(
        "https://raw.githubusercontent.com/streamlit/streamlit/main/docs/logo.png",
        width=160,
    )
    st.title("⚡ ALL_knowing")
    st.caption("Executive & Lead Intelligence Platform")
    st.divider()

    navigation = st.radio(
        "Navigation",
        [
            "🎯 Lead Finder",
            "🔍 Lead Scraper",
            "🏢 Company Web Scraper",
            "⚙️ Settings",
        ],
        index=0,
    )

    st.divider()

    # Sidebar Quick API Key Status
    st.subheader("🔑 API Key Status")
    groq_ok = bool(os.getenv("GROQ_API_KEY"))
    finnhub_ok = bool(os.getenv("FINNHUB_API_KEY"))
    av_ok = bool(os.getenv("ALPHA_VANTAGE_API_KEY"))

    st.markdown(
        f"""
    - **Groq AI**: {'🟢 Active' if groq_ok else '🔴 Missing'}
    - **Finnhub**: {'🟢 Active' if finnhub_ok else '🔴 Missing'}
    - **Alpha Vantage**: {'🟢 Active' if av_ok else '🔴 Missing'}
    """
    )
    st.info("Tip: Configure API keys in the Settings tab.")


# Header Component
st.markdown(
    """
    <div class="app-header">
        <h1 class="app-title">ALL_knowing Intelligence Engine</h1>
        <p class="app-subtitle">Multi-source automated lead search, LinkedIn profile extraction, and enterprise company intelligence.</p>
    </div>
    """,
    unsafe_allow_html=True,
)


# ==========================================
# 🎯 TAB 1: LEAD FINDER
# ==========================================
if navigation == "🎯 Lead Finder":
    st.header("🎯 Lead Finder & Email Intelligence")
    st.write(
        "Discover professional identities, analyze email domains, search candidate LinkedIn profiles, and run complete automated lead investigations."
    )

    # Sample Lead Loader
    sample_emails = []
    try:
        with backend_context("lead finder"):
            from src.cookie_parse import load_sample_leads

            sample_leads = load_sample_leads()
            sample_emails = [
                s.get("email")
                for s in sample_leads
                if isinstance(s, dict) and s.get("email")
            ]
    except Exception:
        pass

    col_input, col_config = st.columns([2, 1])

    with col_input:
        selected_sample = (
            st.selectbox(
                "Select a sample email (or enter below):",
                ["Custom Email..."] + sample_emails,
            )
            if sample_emails
            else "Custom Email..."
        )
        email_input = st.text_input(
            "Target Email Address:",
            value=(
                selected_sample
                if selected_sample != "Custom Email..."
                else "satya.nadella@microsoft.com"
            ),
            placeholder="e.g. name@company.com",
        )

    with col_config:
        max_profiles_slider = st.slider(
            "Max Profile Candidates:",
            min_value=1,
            max_value=10,
            value=5,
            help="Maximum number of LinkedIn profiles to search & discover.",
        )
        headless_mode = st.checkbox("Headless Browser Scrape", value=True)

    col_b1, col_b2, col_b3 = st.columns(3)
    parse_clicked = col_b1.button("📧 Parse Email", use_container_width=True)
    search_clicked = col_b2.button(
        "🔍 Search LinkedIn Profiles", use_container_width=True
    )
    investigate_clicked = col_b3.button(
        "🚀 Full Lead Investigation", use_container_width=True
    )

    st.divider()

    # 1. Parse Email Logic
    if parse_clicked:
        if not email_input.strip():
            st.warning("Please enter a valid email address.")
        else:
            with st.spinner("Parsing email local-part and domain..."):
                try:
                    with backend_context("lead finder"):
                        from src.email_parse import classify_email

                        parsed = classify_email(email_input.strip())
                        payload = parsed.to_dict()

                    st.success("Email parsed successfully!")
                    m1, m2, m3, m4 = st.columns(4)
                    m1.metric("Local Part Name", payload.get("name") or "N/A")
                    m2.metric("Domain", payload.get("domain") or "N/A")
                    m3.metric("Extracted Company", payload.get("company") or "N/A")
                    m4.metric(
                        "Email Type",
                        (
                            "Corporate 🏢"
                            if payload.get("is_corporate")
                            else "Free Provider ✉️"
                        ),
                    )

                    st.json(payload)
                except Exception as exc:
                    st.error(f"Email parse error: {exc}")

    # 2. Search LinkedIn Logic
    elif search_clicked:
        if not email_input.strip():
            st.warning("Please enter a valid email address.")
        else:
            progress_bar = st.progress(0)
            status_box = st.status("Initiating LinkedIn Candidate Search...")
            try:
                progress_bar.progress(20)
                status_box.update(label="Extracting name and company hints...")

                with backend_context("lead finder"):
                    from src.email_parse import classify_email
                    from src.linkedin_search import search_people_urls

                    parsed = classify_email(email_input.strip())
                    name = parsed.name or email_input.split("@")[0]
                    company = parsed.company if parsed.is_corporate else ""

                progress_bar.progress(50)
                status_box.update(
                    label=f"Searching LinkedIn candidates for '{name}' at '{company}'..."
                )

                with backend_context("lead finder"):
                    candidates = search_people_urls(
                        name,
                        company,
                        max_profiles=max_profiles_slider,
                        headless=headless_mode,
                    )

                progress_bar.progress(100)
                status_box.update(
                    label="Candidate Search Completed!", state="complete"
                )

                if candidates:
                    st.success(f"Found {len(candidates)} profile candidate(s)!")
                    st.dataframe(candidates, use_container_width=True)

                    # Export CSV
                    csv_data = data_to_csv(candidates)
                    st.download_button(
                        label="📥 Export Candidates as CSV",
                        data=csv_data,
                        file_name=f"linkedin_candidates_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                        mime="text/csv",
                    )
                else:
                    st.warning("No candidate profiles were found.")
            except Exception as exc:
                status_box.update(label="Search Failed", state="error")
                st.error(f"LinkedIn candidate search failed: {exc}")

    # 3. Full Lead Investigation Logic
    elif investigate_clicked:
        if not email_input.strip():
            st.warning("Please enter a valid email address.")
        else:
            progress_bar = st.progress(0)
            status_box = st.status("Starting Lead Investigation Pipeline...")
            try:
                progress_bar.progress(10)
                status_box.update(label="Step 1/3: Classifying lead email...")

                with backend_context("lead finder"):
                    from src.orchestrate import run_lead_finder

                progress_bar.progress(30)
                status_box.update(
                    label="Step 2/3: Searching LinkedIn & web company intelligence..."
                )

                # Run full lead investigation
                with backend_context("lead finder"):
                    res = run_lead_finder(
                        email_input.strip(),
                        max_profiles=max_profiles_slider,
                        headless=headless_mode,
                        live=False,
                        no_scrape=False,
                    )

                progress_bar.progress(100)
                status_box.update(
                    label="Investigation Completed!", state="complete"
                )
                st.success("Lead investigation finished!")

                # Display Results Tabs
                t_summary, t_company, t_candidates, t_profiles = st.tabs(
                    [
                        "📋 Overview",
                        "🏢 Company Intelligence",
                        "🔎 Candidates",
                        "👤 Scraped Profiles",
                    ]
                )

                with t_summary:
                    st.subheader("Lead Parsed Profile")
                    parsed = res.get("parsed") or {}
                    c1, c2, c3 = st.columns(3)
                    c1.metric("Target Name", parsed.get("name") or "N/A")
                    c2.metric("Company", parsed.get("company") or "N/A")
                    c3.metric(
                        "Corporate Lead",
                        "Yes" if parsed.get("is_corporate") else "No",
                    )
                    st.json(res)

                with t_company:
                    if res.get("company"):
                        st.subheader("Company Intelligence Dossier")
                        st.json(res["company"])
                    elif res.get("company_error"):
                        st.warning(
                            f"Company search note: {res.get('company_error')}"
                        )

                with t_candidates:
                    candidates = res.get("candidates") or []
                    if candidates:
                        st.dataframe(candidates, use_container_width=True)
                        st.download_button(
                            label="📥 Download Candidates CSV",
                            data=data_to_csv(candidates),
                            file_name="candidates.csv",
                            mime="text/csv",
                        )
                    else:
                        st.info("No candidate URLs generated.")

                with t_profiles:
                    profiles = res.get("profiles") or []
                    if profiles:
                        st.dataframe(profiles, use_container_width=True)
                        st.download_button(
                            label="📥 Download Profiles CSV",
                            data=data_to_csv(profiles),
                            file_name="profiles.csv",
                            mime="text/csv",
                        )
                    else:
                        st.info(
                            "No scraped profile data (scrape skipped or profile protected)."
                        )

            except Exception as exc:
                status_box.update(label="Pipeline Error", state="error")
                st.error(f"Lead investigation pipeline failed: {exc}")


# ==========================================
# 🔍 TAB 2: LEAD SCRAPER
# ==========================================
elif navigation == "🔍 Lead Scraper":
    st.header("🔍 LinkedIn Profile Scraper & Contact Enricher")
    st.write(
        "Scrape individual LinkedIn profiles or enrich person details (name, company, email, phone) using multi-source lookup."
    )

    mode = st.radio(
        "Select Operation:",
        ["Scrape LinkedIn Profile URLs", "Enrich Contact Profile"],
        horizontal=True,
    )

    st.divider()

    if mode == "Scrape LinkedIn Profile URLs":
        st.subheader("Extract LinkedIn Profile Data")

        urls_text = st.text_area(
            "LinkedIn Profile URLs (one per line):",
            value="https://www.linkedin.com/in/williamhgates",
            height=120,
            help="Enter one or multiple LinkedIn profile URLs.",
        )

        col_opts, col_btn = st.columns([2, 1])
        with col_opts:
            headless = st.checkbox(
                "Run Headless Browser", value=True, key="li_headless"
            )
        with col_btn:
            scrape_btn = st.button(
                "⚡ Scrape Profiles", use_container_width=True
            )

        if scrape_btn:
            urls = [
                u.strip()
                for u in urls_text.splitlines()
                if u.strip().startswith("http")
            ]
            if not urls:
                st.warning(
                    "Please enter at least one valid LinkedIn URL starting with http:// or https://"
                )
            else:
                progress_bar = st.progress(0)
                status_box = st.status(
                    f"Scraping {len(urls)} LinkedIn profile(s)..."
                )
                try:
                    progress_bar.progress(30)

                    with backend_context("lead scraper"):
                        from src.config import get_settings
                        from src.scraper import run

                        settings = get_settings()
                        settings.headless = headless
                        if headless:
                            settings.checkpoint_timeout_seconds = min(
                                settings.checkpoint_timeout_seconds, 20
                            )
                            settings.delay_min_seconds = min(
                                settings.delay_min_seconds, 0.6
                            )
                            settings.delay_max_seconds = min(
                                settings.delay_max_seconds, 1.2
                            )

                        profiles = run(settings, urls=urls)

                    progress_bar.progress(100)
                    status_box.update(
                        label="Scrape Finished!", state="complete"
                    )

                    if profiles:
                        st.success(
                            f"Successfully scraped {len(profiles)} profile(s)!"
                        )
                        st.dataframe(profiles, use_container_width=True)

                        # CSV Export Button
                        csv_content = data_to_csv(profiles)
                        st.download_button(
                            label="📥 Download Scraped Profiles CSV",
                            data=csv_content,
                            file_name=f"linkedin_profiles_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                            mime="text/csv",
                        )
                    else:
                        st.warning(
                            "No profile data returned. The browser may have required authentication or checkpoint."
                        )
                except Exception as exc:
                    status_box.update(
                        label="Profile Scrape Error", state="error"
                    )
                    st.error(f"LinkedIn scraper failed: {exc}")

    elif mode == "Enrich Contact Profile":
        st.subheader("Contact Profile Enrichment")

        c1, c2 = st.columns(2)
        with c1:
            e_name = st.text_input(
                "Full Name:", value="Satya Nadella", placeholder="e.g. Elon Musk"
            )
            e_company = st.text_input(
                "Company Name:", value="Microsoft", placeholder="e.g. Tesla"
            )
            e_role = st.text_input(
                "Title / Role:",
                value="Chief Executive Officer",
                placeholder="e.g. CEO",
            )

        with c2:
            e_email = st.text_input(
                "Email Address:",
                value="satya@microsoft.com",
                placeholder="e.g. elon@tesla.com",
            )
            e_location = st.text_input(
                "Location:",
                value="Redmond, WA",
                placeholder="e.g. San Francisco, CA",
            )
            e_phone = st.text_input(
                "Phone Number (optional):", value="", placeholder="+1..."
            )

        enrich_btn = st.button("✨ Enrich Contact", use_container_width=True)

        if enrich_btn:
            if not any(
                [
                    e_name.strip(),
                    e_email.strip(),
                    e_company.strip(),
                    e_phone.strip(),
                ]
            ):
                st.warning(
                    "Please enter at least a name, email, or company to perform enrichment."
                )
            else:
                with st.spinner("Enriching contact profile..."):
                    try:
                        row = {
                            "name": e_name.strip() or None,
                            "current_company": e_company.strip() or None,
                            "current_role": e_role.strip() or None,
                            "location": e_location.strip() or None,
                            "email": e_email.strip() or None,
                            "phone": e_phone.strip() or None,
                            "url": "",
                            "linkedin_profile_url": "",
                            "links": [],
                            "error": None,
                        }
                        hints = {
                            "name": e_name.strip(),
                            "company": e_company.strip(),
                            "role": e_role.strip(),
                            "location": e_location.strip(),
                            "email": e_email.strip(),
                            "phone": e_phone.strip(),
                        }

                        with backend_context("lead scraper"):
                            from src.contacts import enrich_profile

                            enriched = enrich_profile(row, hints=hints)

                        st.success("Enrichment completed!")
                        st.json(enriched)

                        # Download button
                        st.download_button(
                            label="📥 Download Enriched Contact CSV",
                            data=data_to_csv(
                                enriched
                                if isinstance(enriched, dict)
                                else [row]
                            ),
                            file_name=f"enriched_contact_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                            mime="text/csv",
                        )
                    except Exception as exc:
                        st.error(f"Contact enrichment failed: {exc}")


# ==========================================
# 🏢 TAB 3: COMPANY WEB SCRAPER
# ==========================================
elif navigation == "🏢 Company Web Scraper":
    st.header("🏢 Multi-Source Company Intelligence")
    st.write(
        "Synthesize comprehensive company dossiers using SEC Edgar, Yahoo Finance, Wikipedia, Finnhub, Alpha Vantage, GitHub, and News API."
    )

    c_query, c_mode = st.columns([3, 1])

    with c_query:
        company_query = st.text_input(
            "Company Name or Ticker Symbol:",
            value="Microsoft",
            placeholder="e.g. Microsoft, AAPL, Tesla, NVIDIA",
        )

    with c_mode:
        fast_mode = st.checkbox(
            "Fast / Lite Mode",
            value=False,
            help="Skips deep news extraction for faster initial result generation.",
        )

    b_col1, b_col2, b_col3 = st.columns(3)
    run_dossier_btn = b_col1.button(
        "🚀 Run Deep Company Scraper", use_container_width=True
    )
    run_news_btn = b_col2.button(
        "📰 Fetch Latest News Only", use_container_width=True
    )
    load_cached_btn = b_col3.button(
        "📂 Load Saved Reports", use_container_width=True
    )

    st.divider()

    # 1. Run Deep Company Dossier Scraper
    if run_dossier_btn:
        if not company_query.strip():
            st.warning("Please enter a company name or ticker symbol.")
        else:
            progress_bar = st.progress(0)
            status_box = st.status(
                f"Gathering Multi-Source Intelligence for '{company_query.strip()}'..."
            )

            def update_progress(pct: int, step_desc: str):
                progress_bar.progress(pct)
                status_box.update(label=f"[{pct}%] {step_desc}")

            try:
                with backend_context("web scraper"):
                    from src.pipeline import run_pipeline, set_progress_callback

                    set_progress_callback(update_progress)

                    dossier = asyncio.run(
                        run_pipeline(
                            company_query.strip(),
                            use_groq=not fast_mode,
                            use_playwright=not fast_mode,
                            skip_news=fast_mode,
                            lite=fast_mode,
                        )
                    )
                    payload = dossier.model_dump()

                status_box.update(
                    label="Company Intelligence Dossier Completed!",
                    state="complete",
                )
                st.success(
                    f"Dossier generated for {payload.get('company', {}).get('name') or company_query}!"
                )

                # Render Company Overview Cards
                comp_info = payload.get("company") or {}
                overview = payload.get("overview") or {}
                financials = payload.get("financials") or {}

                m1, m2, m3, m4 = st.columns(4)
                m1.metric("Official Name", comp_info.get("name") or "N/A")
                m2.metric("Ticker Symbol", comp_info.get("ticker") or "N/A")
                m3.metric("Domain", comp_info.get("domain") or "N/A")
                m4.metric("CIK Code", comp_info.get("cik") or "N/A")

                st.subheader("Financial Overview & Market Metrics")
                f1, f2, f3, f4 = st.columns(4)
                f1.metric("Market Cap", financials.get("market_cap") or "N/A")
                f2.metric("P/E Ratio", financials.get("pe_ratio") or "N/A")
                f3.metric("52-Week High", financials.get("week_52_high") or "N/A")
                f4.metric("52-Week Low", financials.get("week_52_low") or "N/A")

                # Tabs for Details
                t_summary, t_news, t_raw = st.tabs(
                    ["📝 Executive Summary", "📰 News Digest", "🛠️ Raw Dossier JSON"]
                )

                with t_summary:
                    st.markdown(
                        f"### {overview.get('short_description') or 'Company Overview'}"
                    )
                    st.write(
                        overview.get("description")
                        or "No long description available."
                    )
                    if overview.get("key_executives"):
                        st.write("**Key Executives:**")
                        st.json(overview.get("key_executives"))

                with t_news:
                    news_data = payload.get("news") or {}
                    articles = news_data.get("articles") or []
                    if news_data.get("digest_summary"):
                        st.info(news_data.get("digest_summary"))
                    if articles:
                        st.dataframe(articles, use_container_width=True)
                        st.download_button(
                            label="📥 Download News Articles CSV",
                            data=data_to_csv(articles),
                            file_name=f"{company_query}_news.csv",
                            mime="text/csv",
                        )
                    else:
                        st.info("No news articles extracted.")

                with t_raw:
                    st.json(payload)
                    st.download_button(
                        label="📥 Download Full Dossier JSON",
                        data=json.dumps(payload, indent=2),
                        file_name=f"{company_query}_dossier.json",
                        mime="application/json",
                    )

            except Exception as exc:
                status_box.update(label="Scraper Failed", state="error")
                st.error(f"Company web scraper failed: {exc}")
            finally:
                with backend_context("web scraper"):
                    from src.pipeline import set_progress_callback

                    set_progress_callback(None)

    # 2. Fetch Latest News Only
    elif run_news_btn:
        if not company_query.strip():
            st.warning("Please enter a company name or ticker symbol.")
        else:
            with st.spinner(f"Fetching news for {company_query}..."):
                try:
                    with backend_context("web scraper"):
                        from src.pipeline import fetch_company_news

                        news_payload = asyncio.run(
                            fetch_company_news(
                                company_query.strip(),
                                use_groq=not fast_mode,
                                use_playwright=not fast_mode,
                            )
                        )

                    st.success("News fetched successfully!")
                    articles = news_payload.get("articles") or []
                    if articles:
                        st.dataframe(articles, use_container_width=True)
                        st.download_button(
                            label="📥 Download News CSV",
                            data=data_to_csv(articles),
                            file_name=f"{company_query}_news.csv",
                            mime="text/csv",
                        )
                    else:
                        st.warning("No news articles found.")
                except Exception as exc:
                    st.error(f"News fetch failed: {exc}")

    # 3. Load Cached / Saved Reports
    elif load_cached_btn:
        with st.spinner("Loading cached company reports..."):
            try:
                with backend_context("web scraper"):
                    from src.store import list_companies

                    reports = list_companies()

                if reports:
                    st.success(f"Found {len(reports)} saved company report(s)!")
                    st.dataframe(reports, use_container_width=True)
                else:
                    st.info("No saved company reports found in local storage.")
            except Exception as exc:
                st.error(f"Failed to list saved reports: {exc}")


# ==========================================
# ⚙️ TAB 4: SETTINGS
# ==========================================
elif navigation == "⚙️ Settings":
    st.header("⚙️ Application Settings & API Keys")
    st.write(
        "Manage API credentials for external integrations (Groq AI, Finnhub, Alpha Vantage, News API, GitHub, Supabase)."
    )

    st.divider()

    with st.form("settings_form"):
        st.subheader("🔐 API & LinkedIn Credentials")

        li_email = st.text_input(
            "LinkedIn Account Email:",
            value=os.getenv("LINKEDIN_EMAIL", ""),
            placeholder="your_linkedin_email@domain.com",
            help="Used for LinkedIn candidate searching & profile scraping.",
        )
        li_pass = st.text_input(
            "LinkedIn Account Password:",
            value=os.getenv("LINKEDIN_PASSWORD", ""),
            type="password",
            help="Used for authenticating browser sessions on LinkedIn.",
        )

        st.divider()

        groq_key = st.text_input(
            "Groq API Key:",
            value=os.getenv("GROQ_API_KEY", ""),
            type="password",
            help="Used for LLM company dossier synthesis and news relevance filtering.",
        )
        finnhub_key = st.text_input(
            "Finnhub API Key:",
            value=os.getenv("FINNHUB_API_KEY", ""),
            type="password",
            help="Used for financial metrics and stock quote extraction.",
        )
        av_key = st.text_input(
            "Alpha Vantage API Key:",
            value=os.getenv("ALPHA_VANTAGE_API_KEY", ""),
            type="password",
            help="Used for stock market profile and fundamental data.",
        )
        news_key = st.text_input(
            "NewsAPI Key:",
            value=os.getenv("NEWSAPI_API_KEY", ""),
            type="password",
            help="Used for fetching global executive news articles.",
        )
        gnews_key = st.text_input(
            "GNews API Key:",
            value=os.getenv("GNEWS_API_KEY", ""),
            type="password",
            help="Alternative news API key.",
        )
        github_token = st.text_input(
            "GitHub Token:",
            value=os.getenv("GITHUB_TOKEN", ""),
            type="password",
            help="Used for executive repository and profile enrichment.",
        )
        sec_agent = st.text_input(
            "SEC Edgar User Agent:",
            value=os.getenv(
                "SEC_USER_AGENT", "ALL_knowing_Scraper admin@example.com"
            ),
            help="User Agent header required for SEC Edgar API access.",
        )

        st.subheader("☁️ Cloud Storage (Optional)")
        sb_url = st.text_input(
            "Supabase URL:", value=os.getenv("SUPABASE_URL", "")
        )
        sb_key = st.text_input(
            "Supabase Service Role Key:",
            value=os.getenv("SUPABASE_SERVICE_ROLE_KEY", ""),
            type="password",
        )

        save_settings = st.form_submit_button("💾 Save Environment Settings")

    if save_settings:
        os.environ["LINKEDIN_EMAIL"] = li_email.strip()
        os.environ["LINKEDIN_PASSWORD"] = li_pass.strip()
        os.environ["GROQ_API_KEY"] = groq_key.strip()
        os.environ["FINNHUB_API_KEY"] = finnhub_key.strip()
        os.environ["ALPHA_VANTAGE_API_KEY"] = av_key.strip()
        os.environ["NEWSAPI_API_KEY"] = news_key.strip()
        os.environ["GNEWS_API_KEY"] = gnews_key.strip()
        os.environ["GITHUB_TOKEN"] = github_token.strip()
        os.environ["SEC_USER_AGENT"] = sec_agent.strip()
        os.environ["SUPABASE_URL"] = sb_url.strip()
        os.environ["SUPABASE_SERVICE_ROLE_KEY"] = sb_key.strip()

        st.success("✅ Settings updated successfully for the current session!")
        st.rerun()

    st.divider()

    st.subheader("ℹ️ Deployment & System Information")
    st.markdown(
        f"""
    - **Streamlit Version**: `{st.__version__}`
    - **Python Version**: `{sys.version.split()[0]}`
    - **Root Directory**: `{ROOT}`
    - **Entry Point**: `streamlit_app.py`
    """
    )
