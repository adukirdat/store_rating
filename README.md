# Store Rating

Store Rating is a role-based web application for discovering stores and managing customer ratings. It supports `ADMIN`, `NORMAL_USER`, and `STORE_OWNER` roles.

## Architecture

The React/Vite frontend calls the Express API. The API authenticates JWT bearer tokens, enforces roles and ownership, and uses Prisma 7 with PostgreSQL.

```text
React + Vite (frontend) -> Express API (backend) -> Prisma -> PostgreSQL
```

- `frontend/` — React client, pages, routes, API client, and frontend tests.
- `frontend/src/` — application UI and client utilities.
- `backend/` — Express API, scripts, and backend tests.
- `backend/src/` — routes, middleware, services, validation, and Prisma setup.
- `backend/prisma/` — Prisma schema, migrations, and local-development seed.

## Prerequisites

- Node.js compatible with Vite 8: `^20.19.0 || >=22.12.0`. This project was validated with Node `22.13.0`.
- npm (validated with `10.9.2`).
- PostgreSQL with a local development database.

## Local development

1. Clone the repository and install both applications.

   ```powershell
   git clone <repository-url>
   cd store_rating
   cd backend; npm install
   cd ../frontend; npm install
   cd ..
   ```

2. Create `backend/.env` from `backend/.env.example` and `frontend/.env` from `frontend/.env.example`.

3. Apply local migrations.

   ```powershell
   cd backend
   npx prisma validate
   npx prisma migrate dev
   ```

4. Optionally seed deterministic local demo data after setting a private local `SEED_DEMO_PASSWORD`.

   ```powershell
   node prisma/seed.js
   ```

5. Start the API in one terminal and the frontend in another.

   ```powershell
   cd backend
   npm run dev
   ```

   ```powershell
   cd frontend
   npm run dev
   ```

The default local frontend URL is `http://localhost:5173`; the default API port is `5000`.

## Environment variables

Environment files are ignored by Git. Never commit real values.

### Backend (`backend/.env`)

| Variable | Required | Purpose |
| --- | --- | --- |
| `NODE_ENV` | No (defaults to `development`) | Runtime environment. |
| `PORT` | No (defaults to `5000`) | API listening port. |
| `DATABASE_URL` | Yes | PostgreSQL connection string for Prisma; keep private. |
| `JWT_SECRET` | Yes | JWT signing and verification secret; keep private. |
| `CLIENT_URL` | Required in production; local default is `http://localhost:5173` | Allowed frontend CORS origin. |
| `SEED_DEMO_PASSWORD` | Local seed only | Private password used by the idempotent development seed. |

### Frontend (`frontend/.env`)

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Yes | API base URL. |

`VITE_*` variables are embedded in the browser bundle. They must never contain secrets, credentials, JWT secrets, or database URLs.

## Database and Prisma

Prisma configuration is in `backend/prisma.config.js`; schema and migrations are in `backend/prisma/`.

For local schema changes, update `prisma/schema.prisma`, then create and test a named migration:

```powershell
cd backend
npx prisma validate
npx prisma migrate dev --name <descriptive_migration_name>
npx prisma generate
```

For production, apply already-reviewed migrations only:

```powershell
cd backend
npx prisma migrate deploy
```

Never run `prisma migrate reset`, `prisma db push`, or `prisma migrate dev` against production. The local development seed requires `SEED_DEMO_PASSWORD` and uses idempotent upserts:

```powershell
cd backend
node prisma/seed.js
```

## Roles and API overview

- `ADMIN`: manages users and stores; views administration information.
- `NORMAL_USER`: browses, searches, and sorts stores; submits or updates ratings; updates password.
- `STORE_OWNER`: views their assigned store and rating information.

| Group | Purpose | Access |
| --- | --- | --- |
| `/api/auth` | Signup, login, password update. | Signup/login public; password update authenticated. |
| `/api/admin` | Dashboard, users, stores. | `ADMIN`. |
| `/api/stores` | Store browsing and ratings. | `NORMAL_USER`. |
| `/api/owner` | Assigned-store dashboard. | `STORE_OWNER`. |
| `/api/health` | Liveness check. | Public. |
| `/api/ready` | Database-aware readiness check. | Public. |

The backend is authoritative for authentication, roles, ownership, user identity, and rating ownership.

## Security and operations

- JWT authentication uses environment-only `JWT_SECRET`; passwords use bcrypt.
- Backend RBAC, object-level authorization, validation, safe error handling, targeted authentication rate limits, Helmet headers, and restricted CORS are enabled.
- Passwords, hashes, tokens, and secrets are not logged.
- `/api/health` is liveness; `/api/ready` checks database reachability.
- The API handles `SIGTERM` and `SIGINT` by closing HTTP intake and disconnecting Prisma.

The frontend stores the JWT session in `localStorage` for the current bearer-token SPA model. This is exposed to XSS if arbitrary script execution is possible; enforce a strong hosting CSP and avoid untrusted scripts. Frontend route guards are navigation aids only, not authorization.

## Testing and validation

Regression tests do not modify the developer database. Backend HTTP tests use mocked Prisma; database-specific checks inspect migration/source until an isolated PostgreSQL test database is available.

```powershell
# Backend
cd backend
npm test
node --check src/server.js
npx prisma validate
npx prisma migrate status
npm audit --omit=dev

# Frontend
cd ../frontend
npm test
npm run build
npm audit --omit=dev
```

## Known limitations

### H-02 dependency audit finding

The aligned Prisma `7.10.0` chain resolves `deepmerge-ts@7.1.5`; `npm audit --omit=dev` currently reports three high-severity findings. No forced npm override is used, and the Prisma 8 release candidate is not being adopted as an immediate fix. Reassess when Prisma publishes an officially compatible upstream remediation.

There is no dedicated isolated PostgreSQL integration-test database yet. Critical tests use mocked Prisma and source/migration checks so they cannot alter local development data.

## Deployment checklist

1. Configure production environment variables, including explicit `CLIENT_URL`, private `DATABASE_URL`, and private `JWT_SECRET`.
2. Install dependencies and run `npx prisma migrate deploy` from `backend/`.
3. Build the frontend with `npm run build` from `frontend/`.
4. Serve `frontend/dist/` through HTTPS-capable hosting. Configure an appropriate CSP, `X-Content-Type-Options`, `Referrer-Policy`, frame protection, and secure domain/redirect settings at the hosting layer.
5. Start the backend with `npm start`, then verify `/api/health` and `/api/ready`.

Do not run the development seed in production.

`SEED_DEMO_PASSWORD` is not required for normal API startup and must remain a manual, local-development seed input only.

## Production smoke-test checklist

Run these checks after deployment without printing credentials, tokens, or secrets.

### Infrastructure

- Frontend loads over HTTPS and calls the configured `VITE_API_BASE_URL`.
- Backend starts with `NODE_ENV=production`, explicit `CLIENT_URL`, `DATABASE_URL`, and `JWT_SECRET`.
- PostgreSQL is reachable; `/api/health` returns `200` and `/api/ready` returns `200`.
- Confirm `/api/ready` returns a safe `503` rather than database details when the database is intentionally unavailable in a controlled environment.

### Application flows

- Authenticate, log out, and, where enabled, sign up and update a password.
- As an `ADMIN`, verify dashboard data, user/store creation, search, and sorting.
- As a `NORMAL_USER`, verify store listing, search/sort, rating submission, and rating update.
- As a `STORE_OWNER`, verify the assigned-store dashboard, average rating, and rating/user information.

### Security responses

- Unauthenticated protected requests return `401`.
- A valid user with the wrong role receives `403`.
- Malformed input returns `400`; an unknown route returns `404`.
- Repeated authentication attempts receive `429` at the configured limits: login `10/15 minutes`, signup `5/15 minutes`, password update `5/15 minutes`.
- Confirm response headers are supplied by both the API and static host as intended, and that no secrets appear in logs.

Production process managers and container platforms should deliver `SIGTERM` so the backend can close HTTP intake and disconnect Prisma cleanly.

## Development workflow

Create a focused feature branch, make scoped changes, run tests and the frontend build, validate Prisma changes when applicable, inspect `git diff`, and commit with a meaningful message. Keep secrets out of source control and never use destructive Prisma commands against shared or production databases.
