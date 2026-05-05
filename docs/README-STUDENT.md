# GoFlex Housing — Student Quick Start

This repository contains a FastAPI backend and a React (Vite) frontend. The student-focused README below helps you run, test, and package the project quickly.

Prerequisites
- Python 3.11
- Node.js 18+ (for the frontend)
- Docker (optional, for container testing)

Local setup (recommended)

1. Create a virtual environment and install Python deps:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements-txt.txt
```

2. Run the backend (development):

```powershell
& ".\.venv\Scripts\python.exe" -m uvicorn run:app --reload --port 8000
```

3. Run the frontend (optional):

```bash
cd frontend
npm install
npm run dev
```

Run tests

```powershell
pip install -r requirements-txt.txt
pytest -q
```

Package the project for submission (clean archive)

Use the provided `goflex-clean.zip` creation commands (or ask your instructor to accept the repo without heavy artifacts). The goal is to exclude `.venv`, `node_modules`, logs, and large artifacts.

If you need me to create a cleaned ZIP in your workspace, reply and I'll prepare it now.
