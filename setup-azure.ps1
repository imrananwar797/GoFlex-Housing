# setup-azure.ps1
# GoFlex Housing Azure Setup & Provisioning Automation Script
$ErrorActionPreference = "Stop"

# 1. Resolve az command path
$azPath = "az"
if (-not (Get-Command "az" -ErrorAction SilentlyContinue)) {
    $standardPaths = @(
        "C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin\az.cmd",
        "C:\Program Files (x86)\Microsoft SDKs\Azure\CLI2\wbin\az.cmd"
    )
    foreach ($path in $standardPaths) {
        if (Test-Path $path) {
            $azPath = $path
            break
        }
    }
}

if (-not (Get-Command $azPath -ErrorAction SilentlyContinue) -and -not (Test-Path $azPath)) {
    Write-Error "Azure CLI is not found on your system. Please install it using: winget install -e --id Microsoft.AzureCLI"
}

Write-Host "=== Found Azure CLI at: $azPath ===" -ForegroundColor Green

# 2. Check if logged in, if not run login
Write-Host "Checking Azure login status..."
try {
    & $azPath account show > $null
} catch {
    Write-Host "You are not logged in or session expired. Launching browser to log in..." -ForegroundColor Yellow
    & $azPath login
}

# 3. Define Variables
$subscriptionId = "0696c3f3-aa8d-4943-9963-95842b125143"
$resourceGroup = "GoFlex-Housing"
$location = "eastus"
$acrName = "goflexregistry"
$acaEnv = "goflex-managed-env"
$dbServerName = "goflex-db-server"
$dbUser = "goflex_admin"
$dbPass = "GoFlexSecureDbPass2026!"

# Set active subscription
Write-Host "Setting active subscription: $subscriptionId..." -ForegroundColor Cyan
& $azPath account set --subscription $subscriptionId

# 4. Create Resource Group
Write-Host "Creating/verifying Resource Group: $resourceGroup..." -ForegroundColor Cyan
& $azPath group create --name $resourceGroup --location $location

# 5. Create Azure Container Registry
Write-Host "Creating/verifying Container Registry: $acrName..." -ForegroundColor Cyan
& $azPath acr create --resource-group $resourceGroup --name $acrName --sku Basic --admin-enabled true

# 6. Register Providers
Write-Host "Registering required resource providers..." -ForegroundColor Cyan
& $azPath provider register --namespace Microsoft.App --wait
& $azPath provider register --namespace Microsoft.OperationalInsights --wait

# 7. Create Container App Managed Env
Write-Host "Creating Container Apps Managed Environment: $acaEnv..." -ForegroundColor Cyan
& $azPath containerapp env create --name $acaEnv --resource-group $resourceGroup --location $location

# 8. Create PostgreSQL Database
Write-Host "Creating PostgreSQL Flexible Server: $dbServerName..." -ForegroundColor Cyan
& $azPath postgres flexible-server create --resource-group $resourceGroup --name $dbServerName --location $location --admin-user $dbUser --admin-password $dbPass --sku-name Standard_B1ms --tier Burstable --public-access all --yes

# 9. Create Service Principal
Write-Host "Creating Service Principal credentials for GitHub Actions..." -ForegroundColor Cyan
$spOutput = & $azPath ad sp create-for-rbac --name "goflex-github-actions" --role contributor --scopes /subscriptions/$subscriptionId/resourceGroups/$resourceGroup --sdk-auth

Write-Host "`n=== AZURE PROVISIONING AND SETUP COMPLETE ===" -ForegroundColor Green
Write-Host "Database Server: $dbServerName.postgres.database.azure.com"
Write-Host "Database Admin User: $dbUser"
Write-Host "Database Admin Pass: $dbPass"
Write-Host "`n=== GITHUB ACTIONS SECRET CREDENTIALS ===" -ForegroundColor Green
Write-Host "Copy the JSON block below and save it as your GitHub Repository Secret: AZURE_CREDENTIALS`n"
Write-Host $spOutput -ForegroundColor Yellow
