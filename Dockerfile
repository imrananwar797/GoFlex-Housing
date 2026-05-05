# Use Node.js as base
FROM node:18-slim AS build

# Set working directory
WORKDIR /app

# Copy package files and install
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Use Nginx to serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
