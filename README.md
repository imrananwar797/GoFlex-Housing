# GoFlex Housing - SmartPG Management System (Cyberpunk Sanctuary)

GoFlex Housing is a next-generation co-living ecosystem designed for modern tech professionals and residents. Blending a sleek **"Cyberpunk Sanctuary"** aesthetic with state-of-the-art PropTech, GoFlex integrates AI-driven recommendations, blockchain-ready escrow security, and a premium dashboard system.

Built on a robust monorepo architecture managed via **Turborepo**, the project combines a React + Vite frontend, a Node.js Express core backend, and a Python FastAPI AI microservice.

---

## 🏗️ Project Architecture & Structure

```
GoFlex-Housing/ (Monorepo)
├── apps/
│   └── frontend/            # React + Vite frontend (Tailwind CSS, Framer Motion, Supabase SDK)
├── backend/
│   ├── core/                # Node.js + Express + Prisma ORM (Core Business Logic)
│   ├── ai/                  # Python + FastAPI + SQLAlchemy ORM (AI Recommendations, Subscriptions, Video, Fraud)
│   └── database/            # Common schema/seed migrations
├── blockchain/              # Smart contracts (Solidity contracts, deployment scripts)
├── docs/                    # Detailed system and feature documentation
├── package.json             # Root monorepo configuration
├── turbo.json               # Turborepo task runner configuration
└── docker-compose.yml       # Dev/production container configurations
```

---

## 🚀 Quick Start

### 1. Prerequisites

- **Node.js** 20.0.0 or higher
- **npm** 10.2.4 or higher
- **Python** 3.11 or higher
- **PostgreSQL** database (hosted via Supabase)

### 2. Environment Configuration

Copy the example environment templates and fill in your credentials:

- Frontend: [apps/frontend/.env](file:///d:/GoFlex-Housing/apps/frontend/.env) (and `.env.production`)
- Core Backend: [backend/core/.env](file:///d:/GoFlex-Housing/backend/core/.env)
- AI Microservice: [backend/ai/.env](file:///d:/GoFlex-Housing/backend/ai/.env)

*Main environment variables include database URLs, Stripe credentials, Twilio API keys, and Supabase URLs.*

### 3. Run Locally (Monorepo)

To spin up all services concurrently using Turborepo, run this command from the root of the project:

```bash
npm run dev
```

This launches:
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Core Express Backend**: [http://localhost:8000](http://localhost:8000)
- **AI FastAPI Service**: [http://localhost:8001](http://localhost:8001) (Interactive docs available at `/docs`)

---

## 🔧 Monorepo Package Scripts

You can execute workspace-specific commands from the root directory:

*   **Run All Dev Servers**: `npm run dev`
*   **Run Frontend Only**: `npm run dev:frontend`
*   **Run Core Backend Only**: `npm run dev:core`
*   **Run AI Backend Only**: `npm run dev:ai`
*   **Build Frontend**: `npm run build`
*   **Lint Codebase**: `npm run lint`

---

## 💎 Features Catalog

*   ✅ **Cyberpunk Sanctuary Landing Page**: Fluid Framer Motion animations, location grids, and smart booking bar.
*   ✅ **AI-Powered Recommendation Engine**: Score-based property matching based on resident behavior and preferences.
*   ✅ **User & Resident Dashboards**: Real-time occupancy status, booking histories, and profile settings.
*   ✅ **KYC Documents Pipeline**: Secure upload and verification flow for resident identity checks.
*   ✅ **Subscription Billing**: Stripe-integrated tiered memberships (Essential, Premium, Founder).
*   ✅ **Admin/Owner Management Panels**: Complete user permissions editing, property verification queue, and revenue trends.
*   ✅ **Escrow System**: Web3/blockchain-ready rent holding and conditional release contracts.

---

## 📚 Documentation

For deep dives into design specifications, deployment, and status logs:
*   [DEPLOYMENT_GUIDE.md](file:///d:/GoFlex-Housing/docs/DEPLOYMENT_GUIDE.md) - Detailed local and production setup guide.
*   [PROJECT_STRUCTURE.md](file:///d:/GoFlex-Housing/docs/PROJECT_STRUCTURE.md) - High-level architectural directory map.
*   [IMPLEMENTATION_STATUS.md](file:///d:/GoFlex-Housing/docs/IMPLEMENTATION_STATUS.md) - Detailed breakdown of all phases.
*   [FINAL_SUBMISSION.md](file:///d:/GoFlex-Housing/FINAL_SUBMISSION.md) - Overview of project achievements and roadmaps.

---
*Created by the GoFlex Housing Development Team.*
