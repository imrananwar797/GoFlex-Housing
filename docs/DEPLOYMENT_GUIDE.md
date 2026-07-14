# GoFlex Housing - Comprehensive Deployment Guide

This guide details how to deploy the GoFlex Housing platform to production and configure environment settings.

---

## 🏗️ Architecture Overview

The system is split into three main components:
1.  **Frontend SPA**: A Vite React application with Tailwind CSS and Framer Motion. Recommended hosting: **Vercel** or **Netlify**.
2.  **Core Backend**: An Express Node.js application running TypeScript and Prisma. Recommended hosting: **Render**, **AWS ECS**, or **GCP Cloud Run**.
3.  **AI Microservice**: A Python FastAPI service running SQLAlchemy. Recommended hosting: **Render**, **AWS ECS**, or **GCP Cloud Run**.
4.  **Database**: A PostgreSQL database. Recommended hosting: **Supabase** (Managed PostgreSQL).
5.  **Blockchain**: Solidity smart contracts deployed on Polygon (Amoy testnet or mainnet).

---

## 🔧 Environment Configurations

### 1. Frontend (`apps/frontend/.env` / Vercel Environment Variables)
```env
VITE_API_URL=https://goflex-core-backend.onrender.com
VITE_SOCKET_URL=https://goflex-core-backend.onrender.com
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

### 2. Core Backend (`backend/core/.env` / Render Environment Variables)
```env
PORT=8000
DATABASE_URL="postgresql://postgres.xxx:password@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxx:password@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres"
AI_SERVICE_URL=https://goflex-ai-backend.onrender.com
INTERNAL_SECRET=goflex-internal-m2m-secret
JWT_SECRET=your-production-jwt-secret-here
CORS_ORIGIN=https://goflex-housing.vercel.app

# Optional integrations
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
ADMIN_WALLET_PRIVATE_KEY=your-admin-private-key
ESCROW_CONTRACT_ADDRESS=0x...
```

### 3. AI Microservice (`backend/ai/.env` / Render Environment Variables)
```env
DATABASE_URL="postgresql://postgres.xxx:password@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres"
INTERNAL_SECRET=goflex-internal-m2m-secret
```

---

## 🚀 Production Deployment Steps

### Step 1: Database Setup
1.  Spin up a managed PostgreSQL database (such as on **Supabase**).
2.  Obtain the Connection Pool string (port `5432` or PGBouncer equivalent) for `DATABASE_URL` and the direct connection string for `DIRECT_URL`.
3.  In your local terminal, run Prisma commands to generate models and push schema changes to the live database:
    ```bash
    cd backend/core
    npx prisma generate
    npx prisma db push
    ```

### Step 2: Deploy AI Microservice (Render)
1.  Create a **Web Service** on Render connected to your git repository.
2.  Set **Language** to `Python 3`.
3.  Set the **Build Command** to `pip install -r backend/ai/requirements.txt`.
4.  Set the **Start Command** to `cd backend/ai && uvicorn main:app --host 0.0.0.0 --port $PORT`.
5.  Add the `DATABASE_URL` and `INTERNAL_SECRET` environment variables.

### Step 3: Deploy Core Backend (Render)
1.  Create a **Web Service** on Render.
2.  Set **Language** to `Node`.
3.  Set the **Build Command** to `npm install && npx prisma generate`.
4.  Set the **Start Command** to `cd backend/core && node dist/index.js` (or use `ts-node src/index.ts` if running TypeScript directly).
5.  Add the environment variables (`DATABASE_URL`, `DIRECT_URL`, `AI_SERVICE_URL`, `JWT_SECRET`, `CORS_ORIGIN`).

### Step 4: Deploy Frontend (Vercel)
1.  Import your project into Vercel.
2.  Choose `Vite` as the framework preset.
3.  Set the **Root Directory** to `apps/frontend`.
4.  Add environment variables (`VITE_API_URL`, `VITE_SOCKET_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
5.  Deploy. Vercel will build the distribution bundle and host it on its global edge network.

---

## 🐳 Docker Deployment

The repository includes a `docker-compose.yml` configuration. To run all services in containers locally:

1.  Configure environment variables in a root `.env` file.
2.  Run the composition command:
    ```bash
    docker-compose up -d --build
    ```

For production-grade Docker deployment, use `docker-compose.prod.yml`:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 🆘 Troubleshooting

**1. "Can't reach database server" / Prisma Errors**
- Double-check the DB Connection String. If hosting on Supabase, ensure database access IP whitelist rules (if any) allow connections from Render/Vercel server hosts.
- Verify that both `DATABASE_URL` (pooler) and `DIRECT_URL` (direct connection string for schema changes) are configured.

**2. FastAPI AI Service Host Translation Errors**
- If the AI microservice fails to resolve the database host name (e.g. `db.wzrphhppzfczkxxihyiy.supabase.co`), verify network connectivity to the database or DNS settings on the hosting platform.

**3. CORS Blocking Errors**
- Verify that `CORS_ORIGIN` in `backend/core` exactly matches the URL of your deployed frontend app (e.g. `https://goflex-housing.vercel.app`) without trailing slashes.
