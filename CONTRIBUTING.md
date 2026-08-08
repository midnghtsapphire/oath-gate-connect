# Contributing to Oath Gate Connect (Ordain.Church)

Thanks for helping improve the ordination and marriage ceremony platform.

## Quick setup

1. Copy `.env.example` → `.env` and set at least `JWT_SECRET` and (for AI ceremonies) `OPENROUTER_API_KEY`.
2. Backend: `python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt`
3. Frontend: `npm ci`
4. Init DB: `python -c "from server.database import init_db; init_db()"`
5. Dev frontend: `npm run dev` (Vite on port 8080)
6. Dev API: `uvicorn server.main:app --reload --port 8001`

## Checks before opening a PR

```bash
npm run build
python -m pytest -q
```

## PR expectations

- Conventional commit titles (`feat:`, `fix:`, `docs:`, `chore:`, `test:`, `ci:`).
- No secrets in the tree (`.env`, keys, local `*.db`).
- New behavior ships with a regression test when practical.
- Full review jury runs on every PR: OpenRouter AI review, Jules, Semgrep, CodeQL, and CI.

## Security notes

- Never commit `.env` or database files.
- CORS is an explicit allow-list (`CORS_ORIGINS` / `APP_URL`); do not reintroduce `allow_origins=["*"]` with credentials.
- Prefer environment variables for Stripe, OAuth, and OpenRouter credentials.
