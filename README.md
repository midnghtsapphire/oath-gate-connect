# Oath Gate Connect (Ordain.Church)

Fully functional ordination and marriage ceremony platform with a FastAPI backend,
React/Vite frontend, authentication, AI ceremony generation, and certificate management.

## Live Deployment

Production URL is configured per environment via `APP_URL`.

- Local API + static: `http://localhost:8001`
- Local Vite dev server: `http://localhost:8080`
- OpenAPI docs (local): `http://localhost:8001/docs`
- Health check: `GET /api/health`

> When a public Vercel/DigitalOcean URL is provisioned, replace this section with the
> verified live URL (Definition of Done: live URL in README).

## Features

### Authentication

- Email/password registration and login
- Google OAuth and Apple Sign-In callbacks
- JWT session tokens with bcrypt password hashing

### Backend

- SQLite (local) or PostgreSQL (Docker/production)
- 50-state marriage law API
- AI ceremony builder via OpenRouter
- Digital certificates with QR verification
- Stripe checkout (test/live dual mode)

### Frontend

- React + TypeScript + Vite + Tailwind + shadcn/ui
- Ceremony builder, certificate generator, accessibility modes

## Tech stack

| Layer | Stack |
| --- | --- |
| Backend | FastAPI, SQLAlchemy, JWT, OpenRouter, Stripe, ReportLab |
| Frontend | React 18, TypeScript, Vite, Tailwind, shadcn/ui |
| Ops | Docker multi-stage build, docker-compose, GitHub Actions |

## Quick start

### 1. Dependencies

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
npm ci
```

### 2. Environment

```bash
cp .env.example .env
# set JWT_SECRET and OPENROUTER_API_KEY at minimum
```

### 3. Database

```bash
python -c "from server.database import init_db; init_db()"
```

### 4. Run

```bash
# Frontend dev (optional, port 8080)
npm run dev

# API (serves built frontend from dist/ or static/ when present)
npm run build
uvicorn server.main:app --host 0.0.0.0 --port 8001
```

Visit `http://localhost:8001` and API docs at `/docs`.

### Docker

```bash
docker compose up --build
# app on http://localhost:8001
```

## API surface

| Area | Paths |
| --- | --- |
| Auth | `/api/auth/register`, `/api/auth/login`, `/api/auth/google`, `/api/auth/apple` |
| Marriage laws | `/api/marriage-laws/all`, `/api/marriage-laws/{state}` |
| Ceremonies | `/api/ceremony-builder/generate`, `/api/ceremony-builder/my-ceremonies` |
| Certificates | `/api/certificates/ordination/generate`, `/api/certificates/verify/{id}` |
| Billing | `/api/billing/create-checkout-session`, `/api/billing/subscription` |
| Health | `/api/health` |

## Tests & CI

```bash
python -m pytest -q
npm run build
```

GitHub Actions on every PR:

- **CI** — frontend build + backend pytest
- **AI PR Review (OpenRouter)**
- **Jules PR Reviewer**
- **Semgrep SAST**
- **CodeQL** (actions, JavaScript/TypeScript, Python)

## Security

- Explicit CORS allow-list (`CORS_ORIGINS` / `APP_URL`) — no wildcard with credentials
- Secrets only via environment variables (see `.env.example`)
- `.env`, local databases, and `__pycache__` are gitignored
- Dependabot enabled for npm, pip, and GitHub Actions

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

Private — all rights reserved.

---

Built for Ordain.Church — celebrating all love, all faiths, all people.
