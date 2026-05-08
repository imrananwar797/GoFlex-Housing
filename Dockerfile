# Use Node.js 20 as base (matching engines in package.json)
FROM node:20-slim AS build

# Set working directory
WORKDIR /app

# Copy root package files
COPY package*.json ./
# Copy workspace package files to allow npm to see dependencies
COPY apps/frontend/package*.json ./apps/frontend/
COPY backend/core/package*.json ./backend/core/
COPY backend/ai/package*.json ./backend/ai/

# Install ALL dependencies (including workspaces)
RUN npm install

# Copy entire source
COPY . .

# Build the frontend workspace
RUN npm run build

# Use Nginx to serve
FROM nginx:alpine
# Note: In a monorepo, build output might be in apps/frontend/dist
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
