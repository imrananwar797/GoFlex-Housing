#!/usr/bin/env bash
# azure-setup.sh
# GoFlex Housing Azure Foundations Setup Automation
set -euo pipefail

# Ensure Azure CLI wbin paths are included in the PATH for Git Bash/MINGW environment
export PATH=$PATH:"/c/Program Files/Microsoft SDKs/Azure/CLI2/wbin":"/c/Program Files (x86)/Microsoft SDKs/Azure/CLI2/wbin"

# Define operational variables
RESOURCE_GROUP="GoFlex-Housing"
LOCATION="eastus"
ACR_NAME="goflexregistry"
ACA_ENV="goflex-managed-env"

echo "=========================================================="
echo " Starting GoFlex Housing Azure Setup & Provisioning"
echo "=========================================================="

# 1. Create Resource Group
echo "--> Creating Resource Group '$RESOURCE_GROUP' in region '$LOCATION'..."
az group create --name "$RESOURCE_GROUP" --location "$LOCATION"

# 2. Create Azure Container Registry (Basic SKU, Admin Enabled)
echo "--> Creating Azure Container Registry '$ACR_NAME'..."
az acr create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$ACR_NAME" \
  --sku Basic \
  --admin-enabled true

# 3. Register Container App and Operational Insights providers if not present
echo "--> Registering required Azure resource providers..."
az provider register --namespace Microsoft.App --wait
az provider register --namespace Microsoft.OperationalInsights --wait

# 4. Create Azure Container Apps Managed Environment
echo "--> Creating Azure Container Apps Managed Environment '$ACA_ENV'..."
az containerapp env create \
  --name "$ACA_ENV" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION"

echo "=========================================================="
echo " Azure Setup Complete! Foundational Workspace Ready."
echo "=========================================================="
