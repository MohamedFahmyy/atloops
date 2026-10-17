# AT Loops Enterprise Website & CMS — System Architecture

## 1. High-Level Architecture Overview
`atloops-enterprise` is a decoupled, modern enterprise web application built for **AT Loops** (تكنولوجيا بدون متاهات / Technology Without Mazes).
It separates concerns cleanly between a high-performance React TypeScript Single Page Application (SPA) with Server-Side / Client-Side hydration capabilities, and a robust, secure Laravel 12 REST API and CMS engine.

```
                    +------------------------------------+
                    |       Public Web Visitors /        |
                    |        Corporate Clients           |
                    +-----------------+------------------+
                                      |
                                      v
                    +------------------------------------+
                    |   Frontend SPA (React 19 / Vite)   |
                    |  - English (LTR) / Arabic (RTL)    |
                    |  - Responsive Design Tokens        |
                    |  - TanStack Query Cache            |
                    |  - Visual Page Builder Renderer    |
                    +-----------------+------------------+
                                      |
                           REST API / Sanctum JSON
                                      |
                                      v
                    +------------------------------------+
                    |   Backend Core (Laravel 12 REST)   |
                    |  - /api/v1 Public Endpoints        |
                    |  - /api/v1 Admin Protected Endpoints|
                    |  - Sanctum Auth + Roles/Policies   |
                    |  - CRM & Lead Processing Engine    |
                    |  - Block-based Page Builder Engine |
                    |  - Media Storage & Upload Guard    |
                    +-----------------+------------------+
                                      |
                                      v
                    +------------------------------------+
                    |   Normalized MySQL 8.4 Database    |
                    |  - atloops_enterprise_db           |
                    |  - UTF8MB4 Full Multilingual       |
                    +------------------------------------+
```

## 2. Directory Structure
```
atloops-enterprise/
├── frontend/                     # React 19 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/           # Reusable UI (Button, Card, Modal, MegaMenu, etc.)
│   │   ├── context/              # LanguageContext (EN/AR, RTL/LTR), AuthContext
│   │   ├── pages/
│   │   │   ├── public/           # Home, Services, Solutions, Portfolio, Blog, Contact, etc.
│   │   │   └── admin/            # Dashboard, CMS, PageBuilder, CRM, Media, Settings
│   │   ├── services/             # API client, TanStack queries, endpoints
│   │   ├── types/                # Strict TypeScript interfaces
│   │   ├── utils/                # Localization helpers, date formatters, cn helper
│   │   ├── App.tsx               # Route definitions
│   │   ├── main.tsx              # Application entry point
│   │   └── index.css             # Tailwind v4 / Custom CSS design tokens & RTL support
│   ├── vite.config.ts
│   └── package.json
├── backend/                      # Laravel 12 Enterprise REST API
│   ├── app/
│   │   ├── Http/Controllers/Api/ # Public & Admin Controllers
│   │   ├── Models/               # Eloquent Models with Translations
│   │   ├── Policies/             # Granular RBAC authorization
│   │   └── Services/             # Business logic (Lead distribution, Page blocks)
│   ├── database/
│   │   ├── migrations/           # Normalized relational schema
│   │   └── seeders/              # Verified local test data (superadmin, verified services)
│   ├── routes/
│   │   └── api.php               # Versioned /api/v1 routes
│   └── config/
├── docs/                         # Architecture, API specifications, runbooks
├── deployment/                   # Nginx config, Apache config, environment templates, backup scripts
└── README.md                     # Overview & local setup instructions
```

## 3. Brand Identity & Design Tokens
- **Brand Name**: AT Loops (ات لوبس)
- **Tagline**: تكنولوجيا بدون متاهات (Technology Without Mazes)
- **Primary Color Palette**:
  - `Brand Navy`: `#0B132B` (Depth, stability, enterprise grade)
  - `Brand Blue`: `#1C54F2` / `#2563EB` (Innovation, cloud services)
  - `Brand Cyan / Electric`: `#00D2FF` / `#06B6D4` (High-tech accent)
  - `Emerald Accent`: `#10B981` (Verified trust, success)
  - `Amber Accent`: `#F59E0B` (Featured products, special solutions)
- **Typography**:
  - Latin: Inter / Outfit sans-serif
  - Arabic: Cairo / Alexandria (optimized for readable Arabic UI & enterprise typography)
- **RTL / LTR**: Dynamic document direction (`dir="rtl"` vs `dir="ltr"`), flipped margins/paddings, mirrored directional arrows and navigation drawers.

## 4. Key Systems
1. **Bilingual Public Web Platform**: Full EN & AR coverage for Home, 18 Service categories, Solutions catalog, Portfolio case studies, Blog, and Contact/Lead forms.
2. **Visual Block-Based Page Builder**: Drag/reorder block architecture allowing administrators to build dynamic pages (Hero, Grid, Features, CTA, Testimonials, FAQ, Gallery, Stats) stored in JSON schemas and published safely.
3. **Enterprise CRM & Lead Pipeline**: Inquiries from quote requests, consult bookings, and product pages captured with UTM source tracking, pipeline stages (`New`, `Contacted`, `Qualified`, `Proposal Sent`, `Negotiation`, `Won`, `Lost`), assignment, and notes.
4. **Role-Based Access Control (RBAC)**: Super Admin, Administrator, Content Manager, Marketing Manager, Sales Rep, Support Agent, Read-only Analyst.
5. **Security & SEO**: Sanitized block outputs, CSRF & token auth via Sanctum, rate limiting, granular upload validation, XML sitemaps, OpenGraph tags, JSON-LD structured data.
