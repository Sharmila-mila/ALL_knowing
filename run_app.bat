@echo off
echo Starting ALL_knowing Streamlit Dashboard...
if exist .venv\Scripts\activate.bat (
    call .venv\Scripts\activate.bat
)
streamlit run streamlit_app.py
pause
