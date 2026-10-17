# AT LOOPS — Greenfield Enterprise Website & Content Management Platform

A modern, enterprise-grade digital experience and CMS engineered from scratch for **AT Loops** ([https://atloops.com/](https://atloops.com/)).

This platform is architected as an independent, decoupled monorepo featuring a high-performance **React 19 + TypeScript strict + Vite + Tailwind CSS v4** frontend and a robust **Laravel 13 + PHP 8.4 + MySQL 8.4 + Sanctum** REST API backend.

---

## 1. Architectural Highlights

- **Bilingual & Bidirectional (EN / AR):** Complete support for English (LTR) and Arabic (RTL) with dynamic `dir` attribute switching, Cairo Arabic typography, and localized validation.
- **Visual Page Builder:** Block-based CMS editor allowing authorized administrators to customize sections, reorder blocks, manage drafts, restore revisions, and publish changes directly to the public live website.
- **Enterprise Solutions Catalog:** Configurable software products with searchable categories, platform tags, feature highlights, and inquiry CTAs.
- **Verified Portfolio & Case Studies:** Showcase of genuine AT Loops engineering deliverables (Aswaq Basra, Geshta Contracting, Ghazi Land, Quran For All School, Sirius Stone, Panx Pharma) detailing challenges, architectural solutions, and verified outcomes.
- **Integrated CRM & Lead Pipeline:** Multi-stage lead management pipeline (`new` -> `contacted` -> `qualified` -> `proposal_sent` -> `negotiation` -> `won` -> `lost`), internal team notes, activity audit trail, CSV export, and spam honeypot filtering.
- **Role-Based Access Control (RBAC):** Granular permissions covering `superadmin`, `admin`, `content_manager`, `marketing_manager`, `sales_rep`, `support_agent`, and `analyst`.
- **Media Asset Library:** Safe file upload handling, metadata extraction, SEO alt-tag management, and URL copying.
- **Zero Hallucinated Metrics:** All metrics on both the public site and admin console are database-backed from actual system tables.

---

## 2. Directory Layout

```text
atloops-enterprise/
├── frontend/                   # React 19 + TypeScript + Vite + Tailwind v4
│   ├── public/                 # Favicon, genuine AT Loops brand logos
│   ├── src/
│   │   ├── components/         # Layout (Header, Footer, WhatsApp), PageBuilder renderer
│   │   ├── context/            # LanguageContext (EN/AR), AuthContext (Sanctum)
│   │   ├── pages/
│   │   │   ├── public/         # 19 public pages (Home, Services, Solutions, Portfolio, etc.)
│   │   │   └── admin/          # 8 administration console pages & CMS builder
│   │   ├── services/           # api.ts strongly typed REST client
│   │   └── types/              # Comprehensive TypeScript interfaces
│   ├── package.json
│   └── vite.config.ts
├── backend/                    # Laravel 13 + PHP 8.4 REST API
│   ├── app/
│   │   ├── Http/Controllers/   # Public, Auth, Dashboard, Lead, Media, Page, User controllers
│   │   └── Models/             # 18 Eloquent models with normalized relationships
│   ├── database/
│   │   ├── migrations/         # 28 normalized tables with foreign keys and indexes
│   │   └── seeders/            # DatabaseSeeder with verified AT Loops data
│   ├── routes/
│   │   └── api.php             # 61 versioned REST endpoints under /api/v1
│   └── tests/
│       └── Feature/            # EnterpriseApiTest (11 tests, 143 assertions)
├── deployment/                 # Production Nginx, Apache 2.4, .env.example, backup/rollback
├── docs/                       # Architecture specifications and implementation checklist
└── README.md
```

---

## 3. Verified AT Loops Corporate Reference

- **Headquarters Address:** 72 Arab League Street, Agouza, Giza, Egypt
- **العنوان بالعربية:** 72 شارع جامعة الدول العربية، العجوزة، الجيزة، مصر
- **Corporate Inquiries Phone:** `+201112194828`
- **Direct WhatsApp:** `+201112194828`
- **Official Inquiries Email:** `contact@atloops.com`
- **Official Website:** [https://atloops.com/](https://atloops.com/)

---

## 4. Local Development Setup

### Prerequisites
- PHP 8.4+ with `pdo_mysql`, `openssl`, `mbstring`, `fileinfo` extensions
- Composer 2.x
- Node.js 20+ and npm 10+
- MySQL 8.0+ running on port 3306

### Backend Setup
1. Open terminal in `atloops-enterprise/backend`:
   ```bash
   cd backend
   ```
2. Verify `.env` configuration:
   ```ini
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=atloops_enterprise_db
   DB_USERNAME=root
   DB_PASSWORD=
   ```
3. Run database migrations and seed verified corporate data:
   ```bash
   php artisan migrate:fresh --seed
   ```
4. Verify storage symlink:
   ```bash
   php artisan storage:link
   ```
5. Start the backend development server:
   ```bash
   php artisan serve --port=8000
   ```
   *The API will be accessible at `http://127.0.0.1:8000/api/v1`.*

### Frontend Setup
1. Open a second terminal in `atloops-enterprise/frontend`:
   ```bash
   cd frontend
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will launch at `http://localhost:5173`.*

---

## 5. Seeded Administrative Credentials

The development database is seeded with authentic role accounts for testing:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Super Admin** | `superadmin@atloops.com` | `AtLoops@2026!Secured` | Full system access, RBAC, settings, deletions |
| **Administrator** | `admin@atloops.com` | `AtLoops@2026!Secured` | Content management, lead assignment, media |
| **Sales Rep** | `sales@atloops.com` | `AtLoops@2026!Secured` | CRM leads pipeline, notes, status changes |

*Access the administration console at:* `http://localhost:5173/admin/login`

---

## 6. Testing & Quality Assurance

### Frontend Production Build & TypeScript Verification
```bash
cd frontend
npm run build
```
*Executes `tsc -b && vite build`. Validates strict type safety, JSX syntax, and outputs optimized production assets to `dist/`.*

### Backend Feature & API Test Suite
```bash
cd backend
php artisan test --filter=EnterpriseApiTest
```
*Executes 18 feature tests covering health checks, public endpoints, authenticated CMS routes, RBAC permission enforcement, privilege escalation protection, lead archiving, media validation, rate limiting, and Sanctum tokens. All 164 assertions pass.*

---

## 7. License & Proprietary Rights
Copyright © 2026 AT LOOPS. All rights reserved.
Developed strictly for AT Loops enterprise deployments.
