#!/bin/bash
# GoFlex Housing - Production VM Deployment Helper
# Make sure to run: chmod +x deploy.sh

echo "🚀 Starting GoFlex Housing deployment process..."

# 1. Pull latest changes
echo "📥 Pulling latest changes from Git..."
git pull origin main

# 2. Build Frontend Assets
echo "📦 Installing npm dependencies & building frontend..."
npm install
npm run build

# 3. Rebuild and restart docker containers
echo "🐳 Rebuilding and starting Docker containers..."
docker compose -f docker-compose.prod.yml up -d --build

# 4. Cleanup old/dangling docker images to save disk space
echo "🧹 Cleaning up unused Docker images..."
docker image prune -f

echo "✅ Deployment completed successfully! All services are up-to-date and running."
