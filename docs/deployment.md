# Subakeerthii MP Portfolio Platform — Production Deployment Guide

**SOLVEXA — Software • Automation • Digital Solutions**

---

## 1. Production Hosting Recommendations

| Component | Target Provider | Requirements |
|---|---|---|
| **Public Website** | Vercel / Netlify / Cloudflare Pages | Node.js 20 build runtime, Static Site Output |
| **Admin Dashboard** | Vercel (custom subdomain: `admin.subakeerthiimp.com`) | SPA fallback routing rewrite (`/* -> /index.html`) |
| **Backend API** | Railway / Render / AWS ECS | Node.js 20, 512MB RAM, persistent disk or S3 for uploads |
| **PostgreSQL Database** | Supabase / Neon / AWS RDS | PostgreSQL 16, Connection Pooling, SSL enabled |
| **Media Storage** | Cloudflare R2 / AWS S3 | S3-compatible bucket with public CDN distribution |

---

## 2. Environment Variables Configuration

### Backend (`.env`)
```env
PORT=3001
NODE_ENV=production
DATABASE_URL="postgresql://user:password@db.provider.com:5432/subakeerthii_db?sslmode=require"
SESSION_SECRET="generate_64_character_crypto_random_string"
CORS_ORIGIN="https://subakeerthiimp.com,https://admin.subakeerthiimp.com"
ADMIN_DEFAULT_EMAIL="admin@subakeerthii.com"
ADMIN_DEFAULT_PASSWORD="InitialTemporarySecurePassword123!"
```

### Public Frontend (`frontend/website/.env.production`)
```env
VITE_API_URL="https://api.subakeerthiimp.com/api/v1"
```

### Admin Frontend (`frontend/admin/.env.production`)
```env
VITE_API_URL="https://api.subakeerthiimp.com/api/v1"
```

---

## 3. Step-by-Step Deployment Procedure

### Step 1: Database Setup
1. Provision a PostgreSQL 16 database instance.
2. In the `backend` workspace, execute migrations:
   ```bash
   npx prisma db push
   # or
   npx prisma migrate deploy
   ```
3. Run the initial data seed script:
   ```bash
   npm run seed
   ```

### Step 2: Deploy Express Backend
1. Connect repository branch to Railway / Render.
2. Root directory: `backend`
3. Build Command:
   ```bash
   npm install && npm run build
   ```
4. Start Command:
   ```bash
   npm start
   ```
5. Ensure `PORT` and `DATABASE_URL` environment variables are mapped.
6. Verify `/health` responds with `{"status":"ok"}`.

### Step 3: Deploy Public Frontend (Vercel)
1. Add new project in Vercel.
2. Root directory: `frontend/website`
3. Framework preset: `Vite`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Set `VITE_API_URL` environment variable.

### Step 4: Deploy Admin Dashboard (Vercel)
1. Add new project in Vercel.
2. Root directory: `frontend/admin`
3. Framework preset: `Vite`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add `vercel.json` rewrites for SPA routing:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```
7. Set `VITE_API_URL` environment variable.

---

## 4. Post-Deployment Verification Checklist

- [ ] Health check: `curl https://api.subakeerthiimp.com/health` returns `200`.
- [ ] Public site loads without console errors.
- [ ] Profile photo, monogram, and competency banner render cleanly.
- [ ] Test enquiry submitted on live site appears in PostgreSQL database.
- [ ] Login to Admin dashboard at `https://admin.subakeerthiimp.com/login`.
- [ ] Rotate the initial administrative password immediately after first login.
- [ ] Verify SSL certificates are active across all three domains.
