#!/bin/bash
echo "Starting ALL_knowing Streamlit Dashboard..."
if [ -d ".venv" ]; then
    source .venv/bin/activate
fi
streamlit run streamlit_app.py
