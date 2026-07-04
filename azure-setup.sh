#!/usr/bin/env bash
# azure-setup.sh
# GoFlex Housing Azure Hybrid Foundations Setup Automation
set -euo pipefail

# Ensure Azure CLI wbin paths are included in the PATH for Git Bash/MINGW environment
export PATH=$PATH:"/c/Program Files/Microsoft SDKs/Azure/CLI2/wbin":"/c/Program Files (x86)/Microsoft SDKs/Azure/CLI2/wbin"

# Define operational variables
RESOURCE_GROUP="GoFlex-Housing"
LOCATION="centralindia"  # Target region matching Free F1 tier availability
ACR_NAME="goflexregistry"
PLAN_NAME="goflex-service-plan"
WEBAPP_NAME="GoFlex-Housing"

echo "=========================================================="
echo " Starting GoFlex Housing Azure Hybrid Setup & Provisioning"
echo "=========================================================="

# 1. Create/Verify Resource Group
echo "--> Creating/Verifying Resource Group '$RESOURCE_GROUP' in region '$LOCATION'..."
az group create --name "$RESOURCE_GROUP" --location "$LOCATION"

# 2. Create Azure Container Registry (Basic SKU, Admin Enabled)
echo "--> Creating Azure Container Registry '$ACR_NAME'..."
az acr create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$ACR_NAME" \
  --sku Basic \
  --admin-enabled true

# 3. Create Free F1 Service Plan (Linux)
echo "--> Creating Free Linux App Service Plan '$PLAN_NAME' in '$LOCATION'..."
az appservice plan create \
  --name "$PLAN_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --is-linux \
  --sku F1

# 4. Create Web App (Linux Container)
echo "--> Creating Linux Container Web App '$WEBAPP_NAME'..."
az webapp create \
  --name "$WEBAPP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --plan "$PLAN_NAME" \
  --deployment-container-image-name "$ACR_NAME.azurecr.io/goflex-core-api:latest"

# 5. Configure Web App Connection Settings to point to Supabase Postgres
echo "--> Configuring App Settings (Database and Environment settings)..."
az webapp config appsettings set \
  --name "$WEBAPP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --settings \
    PORT=5000 \
    NODE_ENV=production \
    DATABASE_URL="postgresql://postgres.wzrphhppzfczkxxihyiy:<YOUR_DATABASE_PASSWORD>@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres?pgbouncer=true" \
    DIRECT_URL="postgresql://postgres.wzrphhppzfczkxxihyiy:<YOUR_DATABASE_PASSWORD>@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres" \
    AI_SERVICE_URL="http://localhost:8001" \
    JWT_SECRET="goflex-express-jwt-secret-key-production"

echo "=========================================================="
echo " Azure Hybrid Setup Complete! Foundational Workspace Ready."
echo " App Service URL: https://$WEBAPP_NAME.azurewebsites.net"
echo "=========================================================="
