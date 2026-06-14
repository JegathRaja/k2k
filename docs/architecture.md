# Kadal2Kadaai — System Architecture

## Overview

Kadal2Kadaai is a multi-vendor fish marketplace built on a decoupled frontend/backend architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                        Clients                              │
│   Browser (Next.js)  │  Mobile (Future)  │  Admin Panel    │
└──────────────┬────────────────────────────────────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────────────────────────────────────┐
│                     Cloudflare CDN/WAF                      │
│          DDoS Protection │ SSL Termination │ Edge Cache     │
└──────────────┬──────────────────────┬───────────────────────┘
               │                      │
        ┌──────▼──────┐        ┌──────▼──────┐
        │   Vercel    │        │  Hetzner VPS │
        │  (Frontend) │        │  (Backend)   │
        │  Next.js 15 │        │  Laravel 12  │
        └─────────────┘        └──────┬───────┘
                                      │
                    ┌─────────────────┼──────────────┐
                    │                 │              │
             ┌──────▼──────┐  ┌──────▼──────┐ ┌────▼────┐
             │  PostgreSQL │  │    Redis    │ │   R2    │
             │  (Database) │  │ (Cache/Queue│ │(Storage)│
             └─────────────┘  └─────────────┘ └─────────┘
```

## Component Details

### Frontend (Vercel)
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + ShadCN UI
- **State**: TanStack Query v5 for server state, React Context for auth
- **HTTP**: Axios with interceptors for token refresh
- **Forms**: React Hook Form + Zod validation

### Backend (Hetzner VPS)
- **Framework**: Laravel 12
- **Language**: PHP 8.3
- **Architecture**: Clean Architecture (Controllers → Services → Repositories → Models)
- **API**: REST, versioned at `/api/v1/`
- **Auth**: Laravel Sanctum (token-based for SPA/mobile)
- **Queue**: Laravel Horizon on Redis

### Database (PostgreSQL 16)
- UUID primary keys on all tables
- Soft deletes on key business entities
- Full-text search indexes where needed
- Comprehensive foreign key constraints
- Audit trail via `audit_logs` table

### Cache & Queue (Redis 7)
- Session storage
- Rate limiting counters
- Queue jobs (notifications, emails, heavy processing)
- API response caching (categories, settings)

### Storage (Cloudflare R2)
- Product images
- User avatars
- Vendor documents
- Delivery proof photos
- S3-compatible API (Laravel's S3 disk driver)

## Design Patterns

### Backend Patterns
- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic encapsulation
- **Form Requests**: Input validation
- **API Resources**: Response transformation
- **Events & Listeners**: Decoupled side effects
- **Policies**: Authorization logic
- **Observers**: Model lifecycle hooks (audit logging)

### Frontend Patterns
- **Feature Slices**: Code organized by feature, not by type
- **Custom Hooks**: Business logic extracted from components
- **Query Keys Factory**: Centralized TanStack Query key management
- **Provider Composition**: Context providers composed at root
- **Zod Schemas**: Shared validation between forms and API types

## Multi-Portal Architecture

```
kadal2kadaai.com/           → Consumer Marketplace
kadal2kadaai.com/seller/    → Seller Portal
kadal2kadaai.com/fisherman/ → Fisherman Portal
kadal2kadaai.com/delivery/  → Delivery Partner Portal
admin.kadal2kadaai.com/     → Admin Dashboard (separate subdomain)
```

## Security Architecture

1. **Cloudflare WAF** — DDoS, bot protection, IP filtering
2. **Laravel SecurityHeaders Middleware** — CSP, HSTS, X-Frame-Options
3. **Sanctum Token Auth** — Short-lived tokens, rotation
4. **Rate Limiting** — Redis-backed, per-endpoint limits
5. **RBAC** — Spatie Laravel Permission, policy-based authorization
6. **Audit Logging** — Immutable trail of all sensitive actions
7. **Input Validation** — Form Requests with strict rules
8. **SQL Injection** — Eloquent ORM (parameterized queries)
9. **XSS** — Response escaping + Content Security Policy

## Scalability Considerations

- **Horizontal scaling**: Stateless backend (sessions in Redis)
- **Queue workers**: Scalable with Laravel Horizon
- **Database**: Connection pooling via PgBouncer (future)
- **CDN**: Cloudflare caching for static assets + API responses
- **Storage**: R2 globally distributed, no egress fees
