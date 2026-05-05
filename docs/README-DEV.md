Development startup

Recommended (proficient) way to run locally for development:

- Use the provided PowerShell script which sets a local SQLite DB and starts uvicorn with reload:

```powershell
.\start-dev.ps1
```

- Or run manually (PowerShell):

```powershell
$env:DATABASE_URL = 'sqlite:///d:/GoFlex Housing/dev.db'
& ".venv/Scripts/python.exe" -m uvicorn run:app --host 127.0.0.1 --port 8000 --reload --log-level info
```

Why this is recommended:
- The original project expects Postgres in production; for fast local iteration SQLite is a safe fallback.
- The `run:app` import string enables uvicorn reload watching source files.
- `start-dev.ps1` centralizes the startup command so you don't need to remember env vars.

If you prefer Postgres, ensure it is running locally and set `DATABASE_URL` accordingly.

Stable (no-reload) startup

For running the server in the background or under a supervisor, start without reload:

```powershell
.\start-stable.ps1 -DbPath 'd:/GoFlex Housing/dev.db' -Port 8000
```

This will set `DATABASE_URL` to the SQLite file and run uvicorn without `--reload`, which is
more stable for long-running background processes.

Process management options

- Supervisor (systemd-style host): place `supervisord.conf` on the server and run `supervisord -c supervisord.conf`.

- Procfile (platforms like Heroku): the `Procfile` runs uvicorn via the virtualenv python. When deploying to such platforms, ensure the virtualenv and path are correct.

- Docker Compose: a `docker-compose.yml` is included. To run with Postgres locally:

```bash
docker-compose up --build
```

This composes a `db` Postgres service and a `web` service that runs the app and points `DATABASE_URL` to the Postgres container.

Dockerfile and production image

The included `Dockerfile` builds a simple image using `python:3.11-slim`. To build and run the image locally:

```bash
docker build -t goflex-housing .
docker run --rm -e DATABASE_URL=sqlite:///./dev.db -p 8000:8000 goflex-housing
```

Systemd unit (Linux)

An example unit file is available at `dist/smartpg.service`. Copy it to `/etc/systemd/system/smartpg.service`, edit paths/venv, then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now smartpg
sudo journalctl -u smartpg -f
```

Makefile

Use the `Makefile` helper targets for common tasks on Windows with PowerShell/make installed:

```bash
# Start dev server (with reload)
make start-dev

# Start stable server (no reload)
make start-stable

# Docker compose up
make docker-up
```

Continuous Integration

This repo includes a GitHub Actions workflow at `.github/workflows/ci.yml` which:

- Installs Python dependencies and runs simple checks
- Starts the app and verifies `/health`
- Builds the Docker image and validates the container's `/health` endpoint

You can run a local CI smoke-test on Windows using the `ci.ps1` wrapper:

```powershell
.\ci.ps1
```

Postgres integration in CI

The GitHub Actions integration job uses a Postgres service. Add the following repository secrets in GitHub (Settings → Secrets → Actions) to enable the integration job:

- `POSTGRES_USER` (e.g. `smartpg`)
- `POSTGRES_PASSWORD` (e.g. `password`)
- `POSTGRES_DB` (e.g. `smartpg_ci_db`)

If these aren't set, the integration job will fail; for quick runs the unit-tests job doesn't require Postgres and uses SQLite.

Supabase backend for the React app
----------------------------------
1. Create a new Supabase project (or reuse an existing one).
2. Open the SQL editor and run the script in `supabase/schema.sql` to create tables and seed sample data.
3. In Project Settings → API, copy the project URL and anon key.
4. Set the following environment variables for the React app (for local development use `DevServerControl` → `set_env_variable`):
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
5. Restart the React dev server so it picks up the new variables.
6. Visit the app; properties, gallery, testimonials, and FAQs will now read from Supabase if credentials are present, otherwise they fall back to the bundled sample data.
