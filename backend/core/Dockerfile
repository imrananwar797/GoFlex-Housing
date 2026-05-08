# Use Node.js 20 as base
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files and install
COPY package*.json ./
RUN npm install

# Copy source and prisma schema
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the project
RUN npm run build

# Expose port
EXPOSE 8000

# Start the application
CMD ["npm", "start"]
