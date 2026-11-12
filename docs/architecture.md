# Subakeerthii MP Portfolio Platform — System Architecture

**Developed under SOLVEXA — Software • Automation • Digital Solutions**

---

## 1. High-Level Architecture Overview

The platform uses a decoupled three-tier monorepo architecture:

```
[Public Website (React + Vite)]   [Admin Portal (React + Vite)]
          \                                /
           \                              /
            ▼                            ▼
          [Express.js REST API Server (/api/v1)]
                         │
                         ▼
           [PostgreSQL 16 Relational DB (Prisma ORM)]
```

### Core Design Tenets
1. **Separation of Concerns**: Public website and admin dashboard are independent SPAs. Public users never load admin dashboard code, bundles, or authentication state.
2. **Strict Client Accuracy**: The client Subakeerthii MP is accurately designated as a Legal Scholar (pursuing LL.B.), Certified POSH Trainer, Certified POCSO Trainer, and Child Counsellor. Never described as an advocate or licensed lawyer.
3. **Resilient Data Fetching**: The public website uses parallel API fetching with complete, zero-flicker client-side fallbacks. If the API is ever momentarily down, visitors still see a complete, elegant website.
4. **Database-Driven Content Management**: Every section (profile, services, programmes, credentials, audiences, settings) can be updated from the admin portal without code changes.

---

## 2. Directory Layout

```
subakeerthii-portfolio/
├── frontend/
│   ├── website/                  # Public portfolio (React 18 + Vite 5 + TS)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── common/       # Shared utilities (SEO, ScrollToTop)
│   │   │   │   ├── layout/       # Global chrome (Navbar, Footer)
│   │   │   │   └── sections/     # Feature section components + CSS
│   │   │   ├── config/           # Centralized asset metadata
│   │   │   ├── data/             # Resilient client-side fallback content
│   │   │   ├── hooks/            # Custom React hooks
│   │   │   ├── pages/            # Route-level page views
│   │   │   ├── services/api.ts   # Axios client for public endpoints
│   │   │   ├── styles/           # Design system tokens & PageHeader.css
│   │   │   ├── types/            # TypeScript interfaces
│   │   │   └── utils/            # Event dispatchers & media URL resolvers
│   │   └── public/               # Portrait, banner, favicon, robots.txt & sitemap.xml
│   │
│   └── admin/                    # Admin dashboard (React 18 + Vite 5 + TS)
│       └── src/
│           ├── components/       # Shared UI loaders
│           ├── context/          # AuthContext for session management
│           ├── layouts/          # AdminLayout with responsive sidebar
│           ├── pages/            # 11 CRUD and management pages
│           ├── services/         # adminApi Axios client
│           ├── styles/admin.css  # Admin design tokens & data tables
│           ├── types/            # Admin TypeScript definitions
│           └── utils/            # Client image compression & media helpers
│
├── backend/                      # Node.js + Express.js + TypeScript
│   ├── src/
│   │   ├── config/               # Database singleton, paths & Zod env validation
│   │   ├── controllers/          # Public, Auth, Media & Admin controllers
│   │   ├── middlewares/          # Auth, error handler, rate limiters, upload
│   │   ├── repositories/         # Prisma query abstraction layer
│   │   ├── routes/               # Modular Express routers
│   │   ├── types/                # Express session & request augmentations
│   │   ├── utils/                # Token & helper utilities
│   │   ├── validators/           # Zod input schemas
│   │   ├── app.ts                # Express application configuration
│   │   ├── seed.ts               # Idempotent initial seed script
│   │   └── server.ts             # Server entry point & graceful shutdown
│   ├── prisma/
│   │   └── schema.prisma         # Relational models (incl. MediaAsset DB storage)
│   └── public/                   # Official portrait & banner static assets
│
├── docs/                         # Architecture, API, Schema & Deployment docs
├── docker-compose.yml            # Reference production container stack
├── package.json                  # Root npm workspace configuration
└── README.md                     # Setup and operating instructions
```

---

## 3. Security Architecture

1. **HTTP-Only Cookie Sessions**: Admin sessions use cryptographically signed HTTP-only cookies (`subakeerthii.sid`) with `SameSite=Lax` (development) or `SameSite=Strict` (production).
2. **Role-Based Authorization**: Every admin endpoint independently validates the user session and role (`SUPER_ADMIN`, `ADMIN`).
3. **Password Security**: Passwords are saved with bcrypt hashing (work factor 12).
4. **Rate Limiting**:
   - Enquiry submissions: 10 per 15 minutes per IP.
   - Admin login: 8 attempts per 15 minutes per IP.
   - Public APIs: 120 requests per minute per IP.
5. **Privacy-Preserving IP Hashing**: Enquiry submissions hash client IP addresses with SHA-256 (first 16 hex chars) to track spam without storing raw user IPs.
6. **Input Sanitation & Strict Validation**: All client payloads validated using Zod schemas with custom error mappings.
7. **Ethical Safeguard**: Mandatory legal notices explicitly warning visitors not to submit confidential abuse disclosures through web forms, pointing to Childline 1098.
