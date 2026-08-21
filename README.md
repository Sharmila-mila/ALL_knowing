# ALL_knowing — Executive & Lead Intelligence Platform

![Streamlit Application](https://img.shields.io/badge/Streamlit-1.35+-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white)
![Python 3.11](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)

ALL_knowing is a complete executive lead search, LinkedIn profile scraper, and multi-source company web scraper converted into a modern **Streamlit** dashboard.

---

## 🚀 Features

- 🎯 **Lead Finder**: Email domain analysis, name resolution, candidate discovery, and automated lead investigation.
- 🔍 **Lead Scraper**: Full LinkedIn profile scraping, contact enrichment, and experience extraction.
- 🏢 **Company Web Scraper**: Deep company dossiers combining Wikipedia, SEC Edgar, Yahoo Finance, Finnhub, Alpha Vantage, News API, and GNews into synthesized executive reports.
- ⚙️ **Settings & API Management**: Dynamic API key configuration with persistent session state and `.env` loading.
- 📥 **CSV Export**: Export all search & scraper results into CSV format with one click.

---

## 🛠️ Local Installation & Setup

1. **Clone or Download the Repository**
   ```bash
   git clone https://github.com/Sharmila-mila/ALL_knowing.git
   cd ALL_knowing
   ```

2. **Create & Activate Virtual Environment (Python 3.11)**
   ```bash
   python -m venv .venv
   # Windows PowerShell:
   .\.venv\Scripts\Activate.ps1
   # Linux/macOS:
   source .venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   playwright install chromium
   ```

4. **Set Up Environment Variables**
   Copy `.env.example` to `.env` and fill in your API keys (optional, or enter them directly inside the Streamlit settings UI):
   ```bash
   cp .env.example .env
   ```

5. **Run the Streamlit Application**
   ```bash
   streamlit run streamlit_app.py
   ```

---

## ☁️ Deploying to Streamlit Community Cloud

1. Push your repository to **GitHub**.
2. Visit [share.streamlit.io](https://share.streamlit.io/).
3. Connect your GitHub account and select your repository.
4. Set the **Main file path** to `streamlit_app.py`.
5. Under **Advanced Settings**, add your environment variables from `.env.example` into **Secrets**.
6. Click **Deploy**!

---

## 📁 Project Structure

```
d:/ALL_knowing-main/
├── .streamlit/
│   └── config.toml          # Streamlit server & theme configuration
├── lead finder/             # Lead discovery & email parser backend
├── lead scraper/            # LinkedIn profile scraper & contact enricher backend
├── web scraper/             # Multi-source company intelligence backend
├── streamlit_app.py         # Primary Streamlit Application Entrypoint
├── requirements.txt         # Project dependencies
├── .env.example             # Environment variable template
├── .gitignore               # Git ignore file
└── README.md                # Project documentation
```
