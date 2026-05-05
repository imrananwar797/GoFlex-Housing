# Project Structure (brief)

- `run.py`, `smartpg-backend-main.py` - backend entry points (use `run.py` for stable runs)
- `app/` - main FastAPI application package
  - `app/core/` - configuration, database, middleware, monitoring helpers
  - `app/routers/` - route definitions (auth, residents, dashboard, monitoring)
  - `app/models/` - SQLAlchemy models
  - `app/schemas/` - pydantic schemas
- `frontend/` - frontend (Vite + React + TypeScript)
- `tests/` - pytest tests and fixtures
- `Dockerfile`, `cloudbuild.yaml`, `.github/workflows/` - deployment and CI configs
- `gcp/README.md` - Google Cloud Run deployment notes

If you are looking for the health endpoint, check `/health` in `smartpg-backend-main.py`.
