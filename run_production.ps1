# PowerShell Production Launcher for Zuntra Lead Intelligence
Write-Host "Initializing Zuntra Enterprise Production Environment..." -ForegroundColor Green

if (Test-Path ".\not to share\.venv\Scripts\python.exe") {
    & ".\not to share\.venv\Scripts\python.exe" run_production.py
} else {
    python run_production.py
}
