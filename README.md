# Subakeerthii MP — Professional Portfolio & Content Management Platform

**Architected & Developed under SOLVEXA — Software • Automation • Digital Solutions**

---

## 🏛️ Project Overview

A complete, production-quality, responsive and dynamic professional portfolio platform for **Subakeerthii MP** — a Legal Scholar (pursuing LL.B.), Certified POSH Trainer, Certified POCSO Trainer, and Child Counsellor based in Erode, Tamil Nadu, India.

Built using **React 18 + Vite 5 + TypeScript** for the frontend website and admin dashboard, backed by a modular **Express.js + TypeScript** REST API and a **PostgreSQL 16** relational database managed with **Prisma ORM**.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js >= 20.x
- PostgreSQL 16
- npm >= 10.x

### 2. Local Database Initialization
In this environment, PostgreSQL runs via Unix socket:
```bash
# Start PostgreSQL via Unix socket
/usr/lib/postgresql/16/bin/postgres -D /tmp/pgdata -k /tmp -c listen_addresses='' &

# Ensure database exists
/usr/lib/postgresql/16/bin/psql -h /tmp -U postgres -c "CREATE DATABASE subakeerthii_db;"
```

### 3. Backend Setup
```bash
cd backend
npm install
npx prisma db push
npm run seed     # Seeds authentic client profile, 6 services, 6 programmes, credentials, admin user
npm run dev      # Starts API on http://localhost:3001
```

### 4. Public Website Setup
```bash
cd frontend/website
npm install
npm run dev      # Starts public portfolio on http://localhost:5173
```

### 5. Admin Dashboard Setup
```bash
cd frontend/admin
npm install
npm run dev      # Starts admin dashboard on http://localhost:5174
```

---

## 🔐 Initial Administrative Credentials

- **Portal URL**: `http://localhost:5174/login`
- **Email**: `admin@subakeerthii.com`
- **Initial Password**: `ChangeMe123!`

*(Please rotate the password upon first administrative access).*

---

## 📦 Monorepo Workspaces

| Workspace | Port | Purpose |
|---|---|---|
| `frontend/website` | 5173 | Public editorial portfolio with resilient API integration |
| `frontend/admin` | 5174 | Content management & enquiry administration dashboard |
| `backend` | 3001 | Express.js REST API (`/api/v1`) & PostgreSQL Prisma ORM |

---

## 🛡️ Critical Restriction Rules
Subakeerthii MP is currently pursuing her Bachelor of Laws (LL.B.). Under statutory professional restrictions, she is **never** described as an advocate or licensed practicing lawyer. Accurate titles strictly enforced:
- Legal Scholar
- Certified POSH Trainer
- Certified POCSO Trainer
- Child Counsellor

---

## 📄 Documentation Links
- [System Architecture](docs/architecture.md)
- [API Documentation](docs/api-documentation.md)
- [Database Schema](docs/database-schema.md)
- [Production Deployment Guide](docs/deployment.md)

---
*SOLVEXA — Software • Automation • Digital Solutions*
