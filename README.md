# The Capital Code

Financial education platform — a web application for selling and distributing the book **"The Capital Code"** with a digital storefront, user accounts, Stripe payments, newsletter, and an admin dashboard.

## Tech Stack

| Layer       | Technology                                                  |
|-------------|-------------------------------------------------------------|
| Frontend    | **Next.js 15** (React 19, Turbopack)                        |
| Backend API | **Elysia** (Bun runtime, port 4000)                         |
| Database    | **Turso** (libSQL edge database) + **Drizzle ORM**          |
| Email       | **Resend** (transactional + newsletter)                      |
| Payments    | **Stripe** (Checkout Sessions + Webhooks)                    |
| Auth        | **JWT** + **bcryptjs**                                       |
| Deployment  | **Render** / **Fly.io** (Docker)                             |

## Project Structure

```
capitalcode/
├── app/                    # Next.js App Router (pages & components)
│   ├── api/                # Next.js API routes (auth, stripe, notify)
│   ├── components/         # Shared React components
│   ├── admin/              # Admin dashboard page
│   ├── pricing/            # Pricing / checkout page
│   ├── qna/                # FAQ page
│   ├── gdpr/ privacy/ terms/  # Legal pages
│   └── user/               # User account page
├── backend/                # Elysia API server (Bun)
│   ├── src/
│   │   ├── db/             # Drizzle schema & DB client
│   │   ├── lib/            # Shared utilities (email, etc.)
│   │   ├── routes/         # API routes (auth, purchases, newsletter, admin, etc.)
│   │   └── index.ts        # Server entry point
│   └── .env                # Backend environment variables
├── lib/                    # Next.js shared utilities (db, email, stripe, i18n)
├── public/                 # Static assets (images, fonts, files)
├── private/                # Protected downloadable files
├── .env                    # Root environment variables (Next.js + shared)
├── .env.local              # Local overrides (gitignored)
├── render.yaml             # Render.com deployment blueprint
├── fly.toml                # Fly.io deployment config
└── Dockerfile              # Docker image for production
```

## Environment Variables

All secrets are stored in `.env` files (**gitignored** — never commit them).

### Root `.env` (Next.js frontend)

```env
# Turso Database
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your_turso_token

# Auth
JWT_SECRET=your_jwt_secret

# Admin
ADMIN_KEY=your_admin_key

# App URL (used in email links)
NEXT_PUBLIC_APP_URL=https://www.thecapitalcode.net

# Resend (email)
RESEND_API_KEY=re_your_resend_key
EMAIL_FROM=Verify <info@thecapitalcode.net>

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs
STRIPE_PRICE_DIGITAL=prod_...
STRIPE_PRICE_PHYSICAL=prod_...
STRIPE_PRICE_BUNDLE=prod_...
```

### Backend `.env` (Elysia API)

```env
# Turso Database
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your_turso_token

# Auth
JWT_SECRET=your_jwt_secret

# Admin
ADMIN_KEY=your_admin_key

# App URL & port
APP_URL=https://www.thecapitalcode.net
PORT=4000

# Resend (email)
RESEND_API_KEY=re_your_resend_key
EMAIL_FROM=Verify <info@thecapitalcode.net>

# IBAN encryption (32 bytes hex)
IBAN_ENCRYPTION_KEY=your_64_char_hex_key
```

> **Important:** Keep `RESEND_API_KEY`, `EMAIL_FROM`, `JWT_SECRET` and `TURSO_*` values **identical** between root `.env` and `backend/.env`.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 20
- [Bun](https://bun.sh/) ≥ 1.1 (for the backend)
- [Turso CLI](https://docs.turso.tech/cli/installation) (optional, for DB management)

### 1. Install dependencies

```bash
# Frontend (Next.js)
npm install

# Backend (Elysia)
cd backend && bun install
```

### 2. Configure environment

```bash
# Copy and fill in the root .env
cp .env.example .env

# Copy and fill in the backend .env
cp backend/.env.example backend/.env
```

### 3. Push database schema

```bash
# From root (Next.js schema)
npm run db:push

# From backend (Elysia schema)
cd backend && bun run db:push
```

### 4. Run development servers

```bash
# Terminal 1 — Next.js frontend (port 3000)
npm run dev

# Terminal 2 — Elysia backend (port 4000)
cd backend && bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Email System

The project uses **Resend** for all transactional emails. Configuration is centralized via environment variables:

| Variable         | Used by           | Description                              |
|------------------|-------------------|------------------------------------------|
| `RESEND_API_KEY` | Frontend + Backend | Resend API key                           |
| `EMAIL_FROM`     | Frontend + Backend | Verified sender address                  |
| `NEXT_PUBLIC_APP_URL` | Frontend      | Base URL for links in frontend emails    |
| `APP_URL`        | Backend            | Base URL for links in backend emails     |

### Email functions

**Frontend** (`lib/email.js`) — used by Next.js API routes:
- `sendVerificationEmail()` — email verification on registration
- `sendPurchaseConfirmation()` — purchase receipt after Stripe payment
- `sendBookUpdateNotification()` — mass notification to subscribers
- `sendSubscribeConfirmation()` — notification subscription confirmation

**Backend** (`backend/src/lib/email.ts`) — used by Elysia routes:
- `sendEmail()` — generic email sender (with dev-mode mock)
- `sendNewsletterConfirmation()` — double opt-in confirmation
- `sendNewsletterWelcome()` — welcome email after confirmation

> In development, if `RESEND_API_KEY` is missing or starts with `re_your`, emails are **logged to console** instead of being sent.

## API Endpoints

### Next.js API Routes (port 3000)

| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| POST   | `/api/auth/register`            | Register new user        |
| POST   | `/api/stripe/webhook`           | Stripe webhook handler   |
| POST   | `/api/notify/subscribe`         | Subscribe to notifications |
| POST   | `/api/notify/send`              | Send mass notification (admin) |

### Elysia API Routes (port 4000)

| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| GET    | `/health`                       | Health check             |
| POST   | `/auth/register`                | Register user            |
| POST   | `/auth/login`                   | Login user               |
| GET    | `/purchases`                    | Get user purchases       |
| POST   | `/purchases`                    | Create purchase          |
| POST   | `/newsletter/subscribe`         | Newsletter subscribe     |
| GET    | `/newsletter/confirm?token=`    | Confirm subscription     |
| GET    | `/newsletter/unsubscribe?token=`| Unsubscribe              |
| GET    | `/admin/data`                   | Admin dashboard data     |
| GET    | `/download/:purchaseId`         | Download purchased file  |
| GET    | `/preview`                      | Preview content          |
| GET/POST | `/reviews`                    | Manage reviews           |
| GET/POST | `/payouts`                    | Manage payouts           |

## Deployment

### Render.com

The project includes a `render.yaml` blueprint. Configure environment variables in the Render dashboard.

```bash
# Deploy via Render Dashboard or CLI
render deploy
```

### Fly.io

```bash
fly deploy
```

### Docker

```bash
docker build -t capitalcode .
docker run -p 3000:3000 --env-file .env capitalcode
```

## Security Notes

1. **Never commit `.env` files** — they are gitignored
2. Use **strong `JWT_SECRET`** in production (≥ 64 characters)
3. Keep **Turso Auth Token** secure
4. Enable **HTTPS** in production
5. Change **`ADMIN_KEY`** from the default value
6. Passwords are hashed with **bcryptjs** (10 salt rounds)

## License

Private project — all rights reserved.
