# Master Development Constitution

This document defines the strict, non-negotiable standards for software development within the Kadal2Kadaai ecosystem.

## 1. Folder Structures
All projects must adhere to a strict domain-driven or feature-driven folder structure:
- **Frontend**: `src/features/{feature-name}/` containing components, hooks, api, and types for that feature. Shared logic belongs in `src/shared/`.
- **Backend**: `app/Domains/{domain-name}/` for bounded contexts, containing Models, Services, and Repositories.

## 2. Naming Standards
- **File Naming**: PascalCase for React components and Classes (`OrderCard.tsx`, `OrderService.php`). camelCase for utility functions and hooks (`useOrder.ts`, `formatDate.ts`).
- **Component Naming**: Must describe their entity and UI function (e.g., `ProductList`, `UserProfileForm`).
- **Hook Naming**: Must start with `use` (e.g., `useFetchOrders`).
- **API Naming**: RESTful conventions must be used (e.g., `GET /api/v1/orders`, `POST /api/v1/products/{id}/approve`).
- **Database Naming**: snake_case for tables and columns (e.g., `order_items`, `created_at`). Plural table names.

## 3. Import & Export Rules
- **Import Rules**: Use absolute paths (`@/components/...`) over relative paths (`../../components`). 
- **Export Rules**: Use named exports exclusively for functions and hooks. Default exports are only permitted for Next.js pages and layouts.

## 4. Dependency Rules
- New dependencies must be approved in PR review.
- Avoid multiple libraries for the same purpose (e.g., don't use both `date-fns` and `moment`).

## 5. Shared Package Rules
- Reusable logic, shared types, and DTOs used across multiple frontends (Admin, Seller, B2C) must be extracted to a shared package workspace (e.g., `@kadal/shared`).

## 6. Module Boundary Rules & Feature Ownership
- Features must not import internal files from other features. They must communicate through exposed public APIs/hooks (`index.ts` of the feature).
- Each top-level feature or domain is owned by a specific engineering squad.

## 7. Forbidden Patterns
- **No Prop Drilling**: Use Context or state management (Zustand/Redux) for deeply nested state.
- **No Inline Styles**: Use the Design System tokens.
- **No Raw SQL**: Use the ORM (Eloquent/Prisma) with query builders. No unparameterized queries.

## 8. Code Review & Definition of Done (DoD)
- **DoD**: Code is linted, strictly typed (no `any`), tests pass, PR approved by 1 senior engineer, deployed to staging without errors.

## 9. Technical Debt & Refactoring Rules
- 10% of every sprint must be allocated to refactoring identified architecture drift or technical debt.
