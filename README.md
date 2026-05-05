# GoFlex Housing - SmartPG Management System

A production-ready FastAPI + React (Vite) project for hostel/PG management with AI, IoT, and rich dashboards.

## Project Structure

```
goflex-housing/
├── backend/                 # FastAPI backend
│   ├── app/                # Application code
│   │   ├── core/          # Configuration & database
│   │   ├── models/        # SQLAlchemy models
│   │   ├── routers/       # API endpoints
│   │   ├── schemas/       # Pydantic schemas
│   │   └── services/      # Business logic
│   ├── database/          # Database schemas & seeds
│   └── Dockerfile         # Backend container
├── src/                    # React frontend (Vite)
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   └── hooks/            # Custom React hooks
├── public/                # Static assets
├── docs/                  # Documentation
├── docker-compose.yml     # Development environment
├── docker-compose.prod.yml # Production environment
└── .env.example          # Environment variables template
```

## Quick Start

### Development (Docker - Recommended)

```bash
# Clone and setup
git clone <repository-url>
cd goflex-housing
cp .env.example .env

# Start all services
docker-compose up -d

# Access
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Local Development

1) Backend

```bash
cd backend
python -m venv .venv
# Windows PowerShell
.venv\Scripts\activate
# Linux/Mac
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```

2) Frontend

```bash
cd src
npm install
npm start
```

## Environment

Copy `.env.example` to `.env` and adjust values for your environment.

## Deployment

### Development
```bash
docker-compose up -d
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

## Features

- ✅ **User Management**: Registration, authentication, 2FA
- ✅ **Property Management**: CRUD operations for properties
- ✅ **Advanced Search**: Filter by location, price, amenities, dates
- ✅ **Real-time Inventory**: Room availability and booking management
- ✅ **Admin Dashboard**: User management and platform analytics
- ✅ **Owner Panel**: Property management for owners
- ✅ **KYC Verification**: Document upload and admin review
- ✅ **Payments**: Stripe subscription integration
- ✅ **Real-time Messaging**: WebSocket-based chat
- ✅ **Notifications**: Email/SMS alerts
- ✅ **Analytics**: Revenue and occupancy reporting

## API Documentation

When running, visit `http://localhost:8000/docs` for interactive API documentation.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

See LICENSE file for details.

## Support

For questions or issues, check the documentation in the `docs/` folder or create an issue in the repository.


