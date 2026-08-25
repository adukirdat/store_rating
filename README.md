# Roxiler Store Rating Application

## Database setup

This project uses PostgreSQL with Prisma. Create a PostgreSQL database, then add its connection string to `backend/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/store_rating?schema=public"
```

From `backend/`, run:

```powershell
npx prisma generate --schema prisma/schema.prisma
npx prisma migrate dev --name init --schema prisma/schema.prisma --url $env:DATABASE_URL
npm run prisma:seed
```

The seed creates these development users, each with password `DemoPassword@1`:

- `admin@example.com` — ADMIN
- `user@example.com` — NORMAL_USER
- `owner@example.com` — STORE_OWNER
