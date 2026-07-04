# GoFlex Housing - Advanced Features Technical Implementation Guide

This guide details the technical implementation and endpoints of the advanced features in the GoFlex Housing monorepo.

---

## 🏗️ Architecture & Component Paths

1.  **Frontend SPA**: Located in `apps/frontend`. Built with React, Vite, Tailwind CSS, and Framer Motion.
2.  **Core Express Backend**: Located in `backend/core`. Built with Node.js, Express, Prisma ORM, and TypeScript.
3.  **AI Microservice**: Located in `backend/ai`. Built with FastAPI, Python, and SQLAlchemy.
4.  **Blockchain Integration**: Located in `blockchain`. Built with Hardhat and Solidity.

---

## 🔧 Feature Implementations

### 1. Subscription & Recurring Billing (Phase 2)
- **Backend Routes**: [backend/core/src/routes/subscription.routes.ts](file:///d:/GoFlex-Housing/backend/core/src/routes/subscription.routes.ts)
- **AI Microservice Endpoints**: `/api/subscriptions/plans`, `/api/subscriptions/create-checkout-session`
- **Frontend Views**: [apps/frontend/src/pages/subscriptions/](file:///d:/GoFlex-Housing/apps/frontend/src/pages/subscriptions/)
- **Flow**: Express core backend acts as a gateway and proxies subscription session creation and plan listings to the Python AI microservice.

### 2. Advanced Analytics Dashboard (Phase 2)
- **Backend Routes**: [backend/core/src/routes/analytics.routes.ts](file:///d:/GoFlex-Housing/backend/core/src/routes/analytics.routes.ts)
- **Controllers**: `analytics.controller.ts`
- **Frontend Views**: [apps/frontend/src/pages/admin/AdminOverview.tsx](file:///d:/GoFlex-Housing/apps/frontend/src/pages/admin/AdminOverview.tsx)
- **Features**: Aggregates occupancy rates, total users/properties/bookings, and daily/monthly revenue metrics using Prisma DB queries.

### 3. Complete Admin Dashboard (Phase 2)
- **Frontend Pages**: [apps/frontend/src/pages/admin/](file:///d:/GoFlex-Housing/apps/frontend/src/pages/admin/)
  - `AdminUsers.tsx` - Role assignment and account suspension.
  - `AdminProperties.tsx` - Verify and approve new properties.
  - `AdminBookings.tsx` - Booking list and refund processing.
  - `AdminFraudAlerts.tsx` - Monitor fraud alerts.

### 4. Property Management Panel for Owners (Phase 2)
- **Backend Routes**: [backend/core/src/routes/owner.routes.ts](file:///d:/GoFlex-Housing/backend/core/src/routes/owner.routes.ts)
- **Frontend Pages**: [apps/frontend/src/pages/owner/](file:///d:/GoFlex-Housing/apps/frontend/src/pages/owner/)
  - `OwnerDashboard.tsx` - High-level metrics.
  - `OwnerProperties.tsx` & `OwnerPropertyDetail.tsx` - Property updates.
  - `OwnerPropertyRevenue.tsx` - Occupancy and revenue trends.
  - `OwnerPropertyReviews.tsx` - Review reply inputs.

### 5. Identity Verification & KYC (Phase 2)
- **Backend Routes**: [backend/core/src/routes/kyc.routes.ts](file:///d:/GoFlex-Housing/backend/core/src/routes/kyc.routes.ts)
- **Controllers**: `kyc.controller.ts`
- **Frontend Pages**: [apps/frontend/src/pages/kyc/](file:///d:/GoFlex-Housing/apps/frontend/src/pages/kyc/)
  - `KYCUpload.tsx` - Upload documents to Supabase storage buckets.
  - `KYCStatus.tsx` - Verification level tracker.

### 6. Escrow Payment Holding (Phase 3)
- **Backend Routes**: [backend/core/src/routes/escrow.routes.ts](file:///d:/GoFlex-Housing/backend/core/src/routes/escrow.routes.ts)
- **Services**: [backend/core/src/services/web3.service.ts](file:///d:/GoFlex-Housing/backend/core/src/services/web3.service.ts)
- **Details**: Uses Ethers.js to read from and write to escrow smart contracts deployed on Polygon. It holds resident deposits on-chain and releases them conditionally.

### 7. AI Recommendation Engine (Phase 4)
- **Backend Routes**: [backend/core/src/routes/ai.routes.ts](file:///d:/GoFlex-Housing/backend/core/src/routes/ai.routes.ts)
- **AI Microservice Endpoints**: `/api/recommendations`
- **Services**: [backend/core/src/services/ai.service.ts](file:///d:/GoFlex-Housing/backend/core/src/services/ai.service.ts)
- **Details**: Express core backend calls the FastAPI Python engine to fetch matching properties for a given user.
