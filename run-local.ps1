# run-local.ps1
# GoFlex Housing - Local Windows Developer Orchestrator
$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Green
Write-Host " Starting GoFlex Housing Local Windows Development Environment" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green

# 1. Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Cyan
if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js is not installed. Please install it from https://nodejs.org"
}
if (-not (Get-Command "python" -ErrorAction SilentlyContinue)) {
    Write-Error "Python is not installed. Please install it from https://python.org"
}

# 2. Check Node packages
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing Node.js workspace dependencies..." -ForegroundColor Yellow
    npm install
}

# 3. Setup/Check Python virtual environment in root (as expected by AI microservice)
if (-not (Test-Path ".venv")) {
    Write-Host "Creating Python virtual environment in root workspace..." -ForegroundColor Yellow
    python -m venv .venv
    Write-Host "Installing Python dependencies for AI backend..." -ForegroundColor Yellow
    & ".\.venv\Scripts\pip.exe" install -r backend/ai/requirements.txt
}

# 4. Generate Prisma Client
Write-Host "Generating Prisma client for core backend..." -ForegroundColor Cyan
Push-Location backend/core
npx prisma generate
Pop-Location

# 5. Launch monorepo dev servers
Write-Host "`nLaunching Turborepo Dev Server (Frontend, Core, AI)..." -ForegroundColor Green
npm run dev
