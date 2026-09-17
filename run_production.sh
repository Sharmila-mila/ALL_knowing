#!/usr/bin/env bash
# Linux/macOS Production Launcher for Zuntra Lead Intelligence
echo "Initializing Zuntra Enterprise Production Environment..."

if [ -f "./not to share/.venv/bin/python" ]; then
    ./not to share/.venv/bin/python run_production.py
elif [ -f "./.venv/bin/python" ]; then
    ./.venv/bin/python run_production.py
else
    python3 run_production.py
fi
