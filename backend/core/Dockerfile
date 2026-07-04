# Stage 1: Build
FROM node:20-slim AS builder
WORKDIR /app

# Install openssl for Prisma compatibility
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package descriptors and install all dependencies (including devDependencies)
COPY package*.json ./
RUN npm install

# Copy source and prisma configuration
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Compile TypeScript to JavaScript (npm run compile runs tsc)
RUN npm run compile

# Stage 2: Production Runner
FROM node:20-slim AS runner
WORKDIR /app

# Install openssl in production stage
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy generated Prisma Client modules from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy compiled JavaScript output
COPY --from=builder /app/dist ./dist

# Expose Port 5000 (User specified Core API port)
EXPOSE 5000
ENV PORT=5000

# Start Express server
CMD ["node", "dist/index.js"]
