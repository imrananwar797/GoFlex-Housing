<#
CI wrapper to run basic checks locally on Windows (PowerShell).
Usage: .\ci.ps1
#>

# Create and activate venv if not present
if (-not (Test-Path ".venv")) {
    python -m venv .venv
}

& ".venv/Scripts/Activate.ps1"

Write-Host "Installing dependencies..."
python -m pip install --upgrade pip
pip install -r requirements-txt.txt

Write-Host "Starting app in background..."
$proc = Start-Process -FilePath ".venv/Scripts/python.exe" -ArgumentList '-m','uvicorn','run:app','--host','127.0.0.1','--port','8000','--log-level','info' -PassThru
Start-Sleep -Seconds 2

$healthy = $false
for ($i=0; $i -lt 30; $i++) {
    try {
        $r = Invoke-RestMethod -Uri http://127.0.0.1:8000/health -UseBasicParsing -TimeoutSec 2
        Write-Host "Health: $($r.status)"
        $healthy = $true
        break
    } catch {
        Write-Host "Waiting for app... ($i)"
        Start-Sleep -Seconds 1
    }
}

if (-not $healthy) {
    Write-Error "App didn't start in time"
    exit 1
}

Write-Host "Stopping app..."
Stop-Process -Id $proc.Id -Force

# Optionally build and run Docker if available
try {
    docker --version | Out-Null
    Write-Host "Docker available: building image..."
    docker build -t goflex-housing:local .
    $cid = docker run --rm -d -p 8001:8000 -e DATABASE_URL=sqlite:///./dev.db goflex-housing:local
    Start-Sleep -Seconds 2
    Invoke-RestMethod -Uri http://127.0.0.1:8001/health -UseBasicParsing
    docker stop $cid | Out-Null
} catch {
    Write-Host "Docker not available or docker step failed: $_"
}

Write-Host "CI checks completed."
