# Bank Skeleton with Telegram Payments

This project recreates your two-panel banking mockup and adds Telegram payment checkout via a BotFather-configured bot.

## What it does

- Responsive bank-style page inspired by your image
- Telegram payment flow through `createInvoiceLink`
- Backend keeps bot tokens private

## GitHub Secrets and Pages deployment

This repository now includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml` that deploys the static frontend to GitHub Pages.

### Add repository secrets

In GitHub: **Settings -> Secrets and variables -> Actions -> New repository secret**

- `API_BASE_URL` (required): public URL of your hosted backend API, for example `https://your-api-host.com/api`
- `TELEGRAM_BOT_USERNAME` (optional): your bot username without `@`
- `TELEGRAM_BOT_TOKEN` (backend host secret, do not expose to Pages)
- `TELEGRAM_PROVIDER_TOKEN` (backend host secret, do not expose to Pages)

### Important architecture note

GitHub Pages is static hosting only. It cannot run `server.js`, so Telegram invoice creation must run on a separate backend host (Render, Railway, Fly.io, Azure, etc.).

### Enable deployment

1. Push to `main`.
2. In GitHub, open **Settings -> Pages**.
3. Under **Build and deployment**, set source to **GitHub Actions**.
4. The `Deploy GitHub Pages` workflow publishes `public/` with a runtime config generated from your secrets.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env file and configure values:
   ```bash
   copy .env.example .env
   ```
3. Edit `.env`:
   - `TELEGRAM_BOT_TOKEN` from BotFather
   - `TELEGRAM_PROVIDER_TOKEN` from BotFather Payments section
   - `TELEGRAM_BOT_USERNAME` (without `@`)
   - `CORS_ORIGIN` when frontend and backend are hosted on different origins
4. Start:
   ```bash
   npm start
   ```
5. Open:
   - `http://localhost:3000`

## Telegram notes

- Your bot must have payments enabled in BotFather.
- Payment provider token must match your PSP (Stripe/etc) configuration in Telegram.
- Webhooks and successful-payment message handling can be added next if you want order fulfillment automation.
