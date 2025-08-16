# Node Backend 

---

## ✨ Features
- **Express** server with configurable `PORT` (default 4000).
- **CORS** allow-list (`CORS_ORIGIN1`, `CORS_ORIGIN2`).
- **Supabase** integration (URL + Service Role + anon/public keys).
- **JWT auth** (access + refresh) with configurable TTLs.
- **Cookie** session options for browser-based clients.
- **SMTP** via Gmail App Password for transactional email.
- **Mini-site (Next.js)** base URL for deep links and email templates.
- **Document auth token** TTL for secure, time-bound links.

---

## 🧰 Prerequisites
- Node.js 18+ and npm (or pnpm/yarn)
- A Supabase project (URL + keys)
- A Gmail **App Password** (not your real password) if using Gmail SMTP
- Git

---

## 🚀 Quick Start

```bash
# 1) Install deps
npm install

# 2) Copy env example and fill in placeholders
cp .env.example .env

# 3) Run in development (nodemon recommended)
npm run dev

# 4) Or run directly
node server.js
```


> Adapt for plain JS if you’re not using TypeScript.

---

## 📦 .env.example

```dotenv
PORT=4000
NODE_ENV=development

CORS_ORIGIN1=http://localhost:3000
CORS_ORIGIN2=http://localhost:3001

SUPABASE_URL=https://YOUR-PROJECT.ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_PUBLIC_KEY=YOUR_SUPABASE_PUBLIC_KEY

JWT_ACCESS_SECRET=CHANGE_ME_ACCESS_SECRET
ACCESS_TOKEN_SECRET=CHANGE_ME_ACCESS_SECRET
ACCESS_TOKEN_TTL_MIN=10
REFRESH_TTL_DAYS=30

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=you@example.com
SMTP_PASS=YOUR_GMAIL_APP_PASSWORD
MAIL_FROM_NAME="Business Registration SL"
MAIL_FROM_EMAIL=no-reply@yourdomain.lk

GOV_PORTAL_BASE_URL=http://localhost:3000

DOC_AUTH_TOKEN_TTL_DAYS=7
```
