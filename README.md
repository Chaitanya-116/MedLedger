# MedLedger - Pharmacy Inventory & Sales Management System

MedLedger is an enterprise-grade Pharmacy Inventory and Sales Management System built with a modern React + TypeScript frontend and a high-performance FastAPI backend.

## Tech Stack

### Frontend (`/client`)
- **Framework**: React 19 / 18 + Vite + TypeScript
- **Styling**: Material UI (MUI v6) + Tailwind CSS (Material 3 aesthetic)
- **Routing**: React Router DOM v7 / v6
- **Data Fetching**: Axios & TanStack Query (React Query v5)
- **Forms & Validation**: React Hook Form + Zod
- **Data Visualization**: Recharts

### Backend (`/server`)
- **Framework**: FastAPI (Python 3.11+)
- **Database ORM**: SQLAlchemy 2.0 (SQLite in dev, PostgreSQL ready for prod)
- **Data Validation & Settings**: Pydantic v2 & Pydantic-Settings
- **Database Migrations**: Alembic
- **Security**: PyJWT & bcrypt (JWT Authentication)
- **Configuration**: Environment variables via `.env` (never committed to Git)

---

## Directory Structure

```text
medledger/
├── client/              # React frontend application
│   ├── src/
│   │   ├── api/         # Axios instance & API clients
│   │   ├── assets/      # Static assets & images
│   │   ├── components/  # Reusable UI, layout & common components
│   │   ├── config/      # Application configuration
│   │   ├── constants/   # App constants
│   │   ├── context/     # React Context definitions
│   │   ├── features/    # Feature modules
│   │   ├── hooks/       # Custom React hooks
│   │   ├── layouts/     # Page layout components
│   │   ├── pages/       # Route page components
│   │   ├── providers/   # Global context providers (MUI, React Query, Router)
│   │   ├── routes/      # Router configuration
│   │   ├── services/    # Business services layer
│   │   ├── styles/      # Global CSS & Tailwind imports
│   │   ├── theme/       # MUI theme configuration
│   │   ├── types/       # TypeScript type definitions
│   │   └── utils/       # Helper functions
│   └── package.json
├── server/              # FastAPI backend server
│   ├── alembic/         # Alembic database migration scripts
│   ├── app/
│   │   ├── api/         # API endpoints & versioned routers
│   │   ├── auth/        # Authentication logic & handlers
│   │   ├── core/        # Core configuration, security & logging
│   │   ├── database/    # Engine, session, Base model, seed service
│   │   ├── dependencies/# FastAPI dependency injection
│   │   ├── middleware/   # Custom FastAPI middleware
│   │   ├── models/      # SQLAlchemy ORM models
│   │   ├── repositories/# Data access layer
│   │   ├── routers/     # API router definitions
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic layer
│   │   └── utils/       # Backend helper functions
│   ├── .env.example     # Environment template (safe for Git)
│   ├── .gitignore       # Ignores .env, *.db, __pycache__, venv
│   ├── main.py          # FastAPI application entrypoint
│   └── requirements.txt
├── docs/                # Architecture documentation
└── README.md
```

---

## Quickstart Guide

### Prerequisites
- Node.js >= 18.x
- Python >= 3.11

### 1. Backend Setup

```bash
cd server

# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create your local environment file from the template
cp .env.example .env
```

**Edit `.env`** and fill in your own values:

| Variable | What to change |
|---|---|
| `SECRET_KEY` | Generate a random 64+ character string (e.g. `python -c "import secrets; print(secrets.token_urlsafe(64))"`) |
| `ADMIN1_PASSWORD` | Set a strong password for the first admin account |
| `ADMIN2_PASSWORD` | Set a strong password for the second admin account |

> ⚠️ **Important:** The `.env` file contains secrets and is **local only**. It is git-ignored and must **never** be committed to version control.

```bash
# Start the backend server
uvicorn app.main:app --reload
```

The FastAPI backend server will be available at `http://localhost:8000`.
API documentation is available at `http://localhost:8000/docs`.

On first startup, the server will automatically:
- Create the SQLite database (`medledger.db`)
- Seed admin accounts using the credentials from your `.env`
- Seed the initial medicines catalog

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The frontend dev server will be available at `http://localhost:5173`.

---

## Environment Variables Reference

All configuration is loaded from environment variables (`.env` file). See [`.env.example`](server/.env.example) for the full template.

| Variable | Description | Default |
|---|---|---|
| `APP_NAME` | Application display name | `MedLedger` |
| `APP_ENV` | Environment name (`development`, `staging`, `production`) | `development` |
| `APP_HOST` | Server bind host | `127.0.0.1` |
| `APP_PORT` | Server bind port | `8000` |
| `SECRET_KEY` | **Required.** JWT signing secret. Must be changed. | — |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime in minutes | `1440` |
| `DATABASE_URL` | SQLAlchemy database URL | `sqlite:///./medledger.db` |
| `CORS_ORIGINS` | JSON array of allowed CORS origins | `["http://localhost:5173"]` |
| `ADMIN1_NAME` | First admin display name | `M. Srinivasa Rao` |
| `ADMIN1_EMAIL` | First admin email | `srinivasa.rao@medledger.io` |
| `ADMIN1_PASSWORD` | First admin password (seed only) | — |
| `ADMIN2_NAME` | Second admin display name | `M. Chaitanya` |
| `ADMIN2_EMAIL` | Second admin email | `chaitanya@medledger.io` |
| `ADMIN2_PASSWORD` | Second admin password (seed only) | — |

---

## Health Check

```
GET /api/v1/health
```

Returns:
```json
{
  "status": "healthy",
  "environment": "development",
  "database": "connected",
  "version": "1.0.0"
}
```

---

## Security Notes

- **No passwords, secret keys, or credentials are stored in source code.**
- All sensitive configuration is loaded from `.env` at runtime.
- `.env` is excluded from Git via `.gitignore`.
- `.env.example` (with placeholder values) is safe to commit and acts as documentation.
- Admin accounts are seeded on first startup from `.env` — running the server again will not create duplicates.
- User registration always assigns the `USER` role; `ADMIN` role cannot be self-assigned.
- Passwords are hashed with bcrypt before storage.
- JWT tokens are signed using the `SECRET_KEY` from `.env`.
