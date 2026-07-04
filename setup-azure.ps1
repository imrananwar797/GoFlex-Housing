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
$location = "centralindia"
$acrName = "goflexregistry"
$planName = "goflex-service-plan"
$webappName = "GoFlex-Housing"

# Set active subscription
Write-Host "Setting active subscription: $subscriptionId..." -ForegroundColor Cyan
& $azPath account set --subscription $subscriptionId

# 4. Create/Verify Resource Group
Write-Host "Creating/verifying Resource Group: $resourceGroup..." -ForegroundColor Cyan
& $azPath group create --name $resourceGroup --location $location

# 5. Create Azure Container Registry
Write-Host "Creating/verifying Container Registry: $acrName..." -ForegroundColor Cyan
& $azPath acr create --resource-group $resourceGroup --name $acrName --sku Basic --admin-enabled true

# 6. Create Free F1 Service Plan (Linux)
Write-Host "Creating/verifying Free Linux App Service Plan: $planName in $location..." -ForegroundColor Cyan
& $azPath appservice plan create --name $planName --resource-group $resourceGroup --location $location --is-linux --sku F1

# 7. Create Web App (Linux Container)
Write-Host "Creating/verifying Web App: $webappName..." -ForegroundColor Cyan
& $azPath webapp create --name $webappName --resource-group $resourceGroup --plan $planName --deployment-container-image-name "$acrName.azurecr.io/goflex-core-api:latest"

# 8. Configure Web App Connection Settings
Write-Host "Configuring App Settings (Database and Environment settings)..." -ForegroundColor Cyan
& $azPath webapp config appsettings set --name $webappName --resource-group $resourceGroup --settings `
    PORT=5000 `
    NODE_ENV=production `
    DATABASE_URL="postgresql://postgres.wzrphhppzfczkxxihyiy:<YOUR_DATABASE_PASSWORD>@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres?pgbouncer=true" `
    DIRECT_URL="postgresql://postgres.wzrphhppzfczkxxihyiy:<YOUR_DATABASE_PASSWORD>@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres" `
    AI_SERVICE_URL="http://localhost:8001" `
    JWT_SECRET="goflex-express-jwt-secret-key-production"

# 9. Create Service Principal
Write-Host "Creating Service Principal credentials for GitHub Actions..." -ForegroundColor Cyan
$spOutput = & $azPath ad sp create-for-rbac --name "goflex-github-actions" --role contributor --scopes /subscriptions/$subscriptionId/resourceGroups/$resourceGroup --sdk-auth

Write-Host "`n=== AZURE HYBRID PROVISIONING AND SETUP COMPLETE ===" -ForegroundColor Green
Write-Host "App Service URL: https://$webappName.azurewebsites.net"
Write-Host "`n=== GITHUB ACTIONS SECRET CREDENTIALS ===" -ForegroundColor Green
Write-Host "Copy the JSON block below and save it as your GitHub Repository Secret: AZURE_CREDENTIALS`n"
Write-Host $spOutput -ForegroundColor Yellow
