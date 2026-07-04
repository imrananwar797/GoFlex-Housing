# GoFlex Housing - Project Structure

The project is structured as an npm workspaces monorepo managed by **Turborepo** to orchestrate building, linting, and running services in parallel.

## Directory Tree Overview

```
goflex-housing-monorepo/
├── apps/
│   └── frontend/              # React Vite SPA Frontend
│       ├── src/
│       │   ├── App.tsx        # Main application component & routes
│       │   ├── index.tsx      # Entry point
│       │   ├── auth/          # Authentication context & hooks
│       │   ├── components/    # Common UI elements
│       │   ├── pages/         # Page components (Home, Amenities, Locations, etc.)
│       │   │   ├── admin/     # Admin overview & management pages
│       │   │   ├── owner/     # Property owner panel pages
│       │   │   ├── kyc/       # KYC identity status & upload pages
│       │   │   └── subscriptions/ # User subscription and plans pages
│       │   └── services/      # API communication clients
│       ├── package.json       # Frontend package configuration
│       └── vite.config.ts     # Vite configuration
│
├── backend/
│   ├── core/                  # Core Express REST API (NodeJS)
│   │   ├── prisma/            # Prisma ORM schema & migrations
│   │   ├── src/
│   │   │   ├── index.ts       # Application gateway
│   │   │   ├── controllers/   # Request-response logic handlers
│   │   │   ├── middleware/    # Auth, validation, rate limiting middlewares
│   │   │   ├── routes/        # Router files matching controllers
│   │   │   ├── services/      # Business logic (e.g. AI-microservice integration, Web3/Prisma clients)
│   │   │   └── utils/         # Helpers & DB client initializers
│   │   └── package.json       # Core backend package configuration
│   │
│   ├── ai/                    # FastAPI Microservice (Python)
│   │   ├── app/
│   │   │   ├── core/          # App setup & middleware
│   │   │   ├── models/        # SQLAlchemy database schemas
│   │   │   ├── routers/       # Recommendation, Subscriptions, Fraud, Video endpoints
│   │   │   ├── schemas/       # Pydantic request-response schemas
│   │   │   └── services/      # Algorithms & external connections
│   │   ├── main.py            # FastAPI Entry Point
│   │   ├── requirements.txt   # Python dependency definition
│   │   └── package.json       # Workspace identification
│   │
│   └── database/              # Shared schemas and legacy SQL seeds
│
├── blockchain/                # Solidity Smart Contracts (Hardhat)
│   ├── contracts/             # Smart contract files (e.g. Escrow contracts)
│   └── package.json           # Blockchain configuration
│
├── docs/                      # Technical specification documents & guides
├── package.json               # Root monorepo workspace configurations
├── turbo.json                 # Turborepo caching & execution configurations
└── docker-compose.yml         # Container definitions for local multi-service running
```

## Component Roles & Interconnections

1.  **Frontend (`apps/frontend`)**: Serves the user interface at port `5173`. Uses the Supabase JS SDK for file uploads and reads directly from the database, while sending all other transactional operations (bookings, payments, auth) to the Express Core Backend.
2.  **Core Backend (`backend/core`)**: Serves business logic and database access at port `8000`. Translates incoming REST queries to operations on the Supabase PostgreSQL database using Prisma ORM. Directs recommendation and subscription request flows towards the Python AI Microservice.
3.  **AI Microservice (`backend/ai`)**: Serves data-heavy processing (recommendations, subscriptions, fraud, and video) at port `8001`. Runs with FastAPI and talks directly to the database via SQLAlchemy.
4.  **Blockchain (`blockchain`)**: Holds escrow contracts on-chain for secure booking and deposit payments, which are queried/interacted with by `backend/core/src/services/web3.service.ts`.
