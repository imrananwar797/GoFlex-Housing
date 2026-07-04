# GoFlex Housing - Developer Documentation

This document describes how to set up, run, and develop the GoFlex Housing project locally.

## Local Development Requirements

- **Node.js**: v20.0.0 or higher
- **npm**: v10.2.4 or higher
- **Python**: v3.11 or higher with virtualenv
- **PostgreSQL**: A running instance or connection to a remote PostgreSQL provider (e.g. Supabase)

---

## 1. Initial Setup

### Workspace Dependencies Installation
First, install all monorepo dependencies from the root directory:
```bash
npm install
```

This will automatically trigger workspace installations inside `apps/frontend`, `backend/core`, and `blockchain`.

### Python Virtual Environment Setup
The AI Microservice requires a Python virtual environment to be set up:
```bash
# Navigate to the microservice folder
cd backend/ai

# Create virtual environment
python -m venv .venv

# Activate it (Windows)
.venv\Scripts\activate
# Activate it (Linux/Mac)
source .venv/bin/activate

# Install requirements
pip install -r requirements.txt
```

---

## 2. Environment Variables Configuration

Copy and configure environment files in each service directory.

### Core Backend (`backend/core/.env`)
Create `backend/core/.env` with:
```env
PORT=8000
DATABASE_URL="postgresql://postgres.xxx:password@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxx:password@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres"
AI_SERVICE_URL=http://localhost:8001
JWT_SECRET=your-express-jwt-secret-key-here
```

### AI Backend (`backend/ai/.env`)
Create `backend/ai/.env` with:
```env
DATABASE_URL="postgresql://postgres.xxx:password@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres"
INTERNAL_SECRET=goflex-internal-m2m-secret
```

### Frontend (`apps/frontend/.env`)
Create `apps/frontend/.env` with:
```env
VITE_API_URL=http://localhost:8000
VITE_SOCKET_URL=http://localhost:8000
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

---

## 3. Database Migration & Push

We use **Prisma** to manage the schema and push migrations to the Postgres database. Run the following in `backend/core`:

```bash
# Generate type-safe Prisma client
npx prisma generate

# Sync schema state with Postgres
npx prisma db push
```

---

## 4. Running the Dev Servers

### The Monorepo Way (Recommended)
You can start all packages simultaneously using Turborepo from the root directory:
```bash
npm run dev
```
This runs the frontend at `http://localhost:5173`, core backend at `http://localhost:8000`, and AI microservice at `http://localhost:8001`.

### Running Components Individually

- **Frontend only**:
  ```bash
  npm run dev:frontend
  ```
- **Core Backend only**:
  ```bash
  npm run dev:core
  ```
- **AI Microservice only**:
  Make sure your virtual environment is active, then:
  ```bash
  npm run dev:ai
  ```

---

## 5. Deployment Checks & Lints

Before checking in changes, verify your work using the monorepo checks:
```bash
# Build frontend
npm run build

# Lint the codebase
npm run lint
```
