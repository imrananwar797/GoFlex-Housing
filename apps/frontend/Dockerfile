# Use Node.js 20 base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Expose Vite dev port
EXPOSE 5173

# Start Vite dev server in host mode
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
