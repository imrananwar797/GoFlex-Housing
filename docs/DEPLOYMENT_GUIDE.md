# GoFlex Housing - Complete Deployment Guide

## � Quick Start

### Development (Docker)
```bash
cd GoFlex-Housing
cp .env.example .env
docker-compose up -d
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Database: localhost:5432

### Production (Docker)
```bash
cd GoFlex-Housing
cp .env.prod.example .env
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📋 Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for frontend development)
- Python 3.11+ (for backend development)
- PostgreSQL (handled by Docker)

---

## 🏗️ Architecture Overview

```
Frontend (React/TypeScript)
    ↓ HTTP/WebSocket
Backend (FastAPI/Python)
    ↓ SQLAlchemy
Database (PostgreSQL)
```

**Key Features Implemented:**
- ✅ User Authentication & Authorization
- ✅ Real-time Messaging (WebSocket)
- ✅ Property Search & Filtering
- ✅ Room Inventory Management
- ✅ Admin Dashboard
- ✅ Owner Property Management
- ✅ KYC Document Verification
- ✅ Stripe Subscription Payments
- ✅ Two-Factor Authentication
- ✅ Rate Limiting & Security
- ✅ Analytics Dashboard

---

## 🔧 Environment Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd GoFlex-Housing
```

### 2. Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
# Database
DB_USER=goflex_user
DB_PASSWORD=your_secure_password
DB_NAME=goflex_db

# Security
SECRET_KEY=your-super-secret-jwt-key-change-in-production

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Email (for notifications)
SMTP_SERVER=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# SMS (Twilio for 2FA)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890

# Frontend
FRONTEND_URL=http://localhost:3000
```

---

## 🐳 Docker Deployment

### Development
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production
```bash
# Build and start production stack
docker-compose -f docker-compose.prod.yml up -d --build

# Scale backend workers
docker-compose -f docker-compose.prod.yml up -d --scale backend=4
```

---

## 💻 Local Development

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd src  # React app is in src/
npm install
npm start
```

### Database Migrations
```bash
cd backend
alembic upgrade head
```

---

## 🔒 Security Features

- JWT Authentication with refresh tokens
- Two-Factor Authentication (TOTP)
- Rate limiting (100 requests/minute per IP)
- CORS protection
- Password hashing (bcrypt)
- Input validation with Pydantic
- SQL injection prevention (SQLAlchemy)

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/token` - Login
- `POST /api/auth/2fa/setup` - Setup 2FA
- `POST /api/auth/2fa/verify` - Verify 2FA

### Properties & Search
- `GET /api/search/properties` - Advanced property search
- `POST /api/owner/properties` - Create property (owners)
- `GET /api/owner/properties` - List owner properties

### Bookings & Inventory
- `GET /api/inventory/rooms/{room_id}/availability` - Check availability
- `POST /api/inventory/rooms/{room_id}/book` - Create booking

### Admin
- `GET /api/admin/users` - User management
- `GET /api/admin/stats` - Platform statistics
- `GET /api/analytics/dashboard` - Analytics dashboard

### Payments
- `GET /api/subscriptions/plans` - Subscription plans
- `POST /api/subscriptions/create-checkout-session` - Stripe checkout

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd src
npm test
```

---

## 📈 Monitoring & Analytics

- Health check: `GET /health`
- API documentation: `GET /docs`
- Analytics dashboard: `GET /api/analytics/dashboard`
- Rate limiting status in response headers

---

## 🚀 Production Checklist

- [ ] Set `DEBUG=False` in environment
- [ ] Use strong `SECRET_KEY`
- [ ] Configure SSL certificates
- [ ] Set up database backups
- [ ] Configure monitoring (Sentry, etc.)
- [ ] Set up log aggregation
- [ ] Configure reverse proxy (nginx)
- [ ] Set up CI/CD pipeline
- [ ] Configure domain and DNS
- [ ] Set up email service (SendGrid, etc.)
- [ ] Configure payment webhooks

---

## 🆘 Troubleshooting

### Common Issues

**Backend won't start:**
- Check database connection
- Verify environment variables
- Check logs: `docker-compose logs backend`

**Frontend build fails:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version (18+)

**Database connection issues:**
- Ensure PostgreSQL is running
- Check connection string in `.env`

**WebSocket connections fail:**
- Verify CORS settings
- Check Socket.IO client configuration

---

## 📞 Support

For issues or questions:
1. Check the logs: `docker-compose logs -f`
2. Review API documentation: http://localhost:8000/docs
3. Check environment variables
4. Verify Docker network connectivity

---

## 🎯 Next Steps

1. **Configure production environment variables**
2. **Set up SSL certificates**
3. **Configure monitoring and alerting**
4. **Set up automated backups**
5. **Implement CI/CD pipeline**
6. **Add more comprehensive tests**
7. **Set up staging environment**

The application is now ready for deployment! 🚀
- PostgreSQL 15+
- Node.js 18+

### Steps

```bash
# 1. Create database
createdb goflex_db
createuser goflex_user

# 2. Initialize schema
psql goflex_db -f backend/database/schema.sql
psql goflex_db -f backend/database/seed.sql

# 3. Install dependencies
cd backend
npm install

# 4. Configure environment
cp .env.example .env
# Edit .env with your values

# 5. Start server
npm run dev
```

---

## Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000

DB_HOST=postgres
DB_PORT=5432
DB_USER=goflex_user
DB_PASSWORD=goflex_secure_password_123
DB_NAME=goflex_db

JWT_SECRET=your-secret-key-here

STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

SENTRY_DSN=
```

---

## API Endpoints

### Health Check
```bash
curl http://localhost:5000/health
```

### Authentication
```bash
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile
PUT /api/auth/profile
POST /api/auth/change-password
```

### Properties
```bash
GET /api/properties
GET /api/properties/:id
POST /api/properties
PUT /api/properties/:id
DELETE /api/properties/:id
```

### Bookings
```bash
POST /api/bookings
GET /api/bookings/user/my-bookings
GET /api/bookings/:id
POST /api/bookings/:id/cancel
PATCH /api/bookings/:id/status
```

### Payments
```bash
POST /api/payments/create-intent
POST /api/payments/confirm
GET /api/payments/history
POST /api/payments/webhook
```

### Blog
```bash
GET /api/blog
GET /api/blog/:slug
POST /api/blog
PUT /api/blog/:id
DELETE /api/blog/:id
```

### Virtual Tours
```bash
GET /api/tours/property/:propertyId
POST /api/tours
PUT /api/tours/:id
DELETE /api/tours/:id
```

---

## Production Deployment

### Hosting Options

1. **Netlify + Railway**
   - Frontend: Netlify
   - Backend: Railway
   - Database: Railway PostgreSQL

2. **Heroku**
   - All-in-one platform
   - Easy setup but higher cost

3. **AWS**
   - EC2 for backend
   - RDS for database
   - CloudFront for CDN
   - Most control and flexibility

4. **DigitalOcean**
   - App Platform for backend
   - Managed DB for PostgreSQL
   - Cost-effective option

### Pre-Deployment

- [ ] Generate strong JWT_SECRET
- [ ] Set up Stripe production keys
- [ ] Configure Sentry DSN
- [ ] Set up SSL certificates
- [ ] Configure CORS for production domain
- [ ] Test all payment flows
- [ ] Set up database backups

---

## Troubleshooting

### Docker Issues
```bash
# Restart services
docker-compose restart

# Clean rebuild
docker-compose down -v
docker-compose up -d

# View logs
docker-compose logs -f backend
```

### Database Issues
```bash
# Reconnect to database
docker-compose exec postgres psql -U goflex_user -d goflex_db

# Backup database
docker-compose exec postgres pg_dump -U goflex_user goflex_db > backup.sql

# Restore database
docker-compose exec postgres psql -U goflex_user goflex_db < backup.sql
```

### API Issues
```bash
# Test endpoint
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/users/dashboard/stats

# Check logs
docker-compose logs backend --tail=50
```

---

## Features Implemented

✅ Docker PostgreSQL setup
✅ Node.js/Express backend
✅ Authentication (JWT)
✅ Property management
✅ Booking system
✅ Stripe payment integration
✅ Virtual tours
✅ Blog/Content management
✅ Resident dashboard
✅ Brand enhancements
✅ Sentry error monitoring

---

**For more details, see the full documentation in this directory.**
