# PostgreSQL Data Import - Startup Script
# This script starts both backend and frontend servers

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  PostgreSQL Data Import Tool - Starting...  " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Start backend in a new PowerShell window
Write-Host "Starting Backend (FastAPI)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "cd '$PSScriptRoot\backend'; Write-Host 'Backend Server' -ForegroundColor Green; python -m uvicorn app.main:app --reload --host localhost --port 8000"

# Wait for backend to initialize
Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start frontend in a new PowerShell window
Write-Host "Starting Frontend (Vite + React)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "cd '$PSScriptRoot\frontend'; Write-Host 'Frontend Server' -ForegroundColor Green; npm run dev"

# Display access information
Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  Servers are starting...                     " -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: " -NoNewline -ForegroundColor Cyan
Write-Host "http://localhost:5173" -ForegroundColor White
Write-Host "Backend:  " -NoNewline -ForegroundColor Cyan
Write-Host "http://localhost:8000" -ForegroundColor White
Write-Host "API Docs: " -NoNewline -ForegroundColor Cyan
Write-Host "http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "To stop servers, close the terminal windows" -ForegroundColor Yellow
Write-Host "or press Ctrl+C in each window" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
