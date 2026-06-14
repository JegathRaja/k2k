# Database Governance Constitution

This document defines the strict rules for database modeling, migrations, and performance in Kadal2Kadaai.

## 1. Entity Ownership
- Every table MUST belong to a specific Domain (e.g., `OrderDomain`, `UserDomain`). 
- Cross-domain queries should ideally be handled at the service level, avoiding massive monolithic joins unless performance critical.

## 2. Relationship Rules & Foreign Key Standards
- All relational associations must have enforced Foreign Keys at the database level.
- `ON DELETE RESTRICT` is the default. `ON DELETE CASCADE` is only permitted for tightly coupled sub-entities (e.g., deleting a Cart cascades to CartItems).

## 3. Indexing Strategy
- Primary Keys (`id` UUIDs or BigInts) are automatically indexed.
- Foreign Keys MUST always have an index.
- Columns used frequently in `WHERE` clauses (e.g., `status`, `email`) must be indexed.
- Unique constraints must be applied at the database level, not just the application level.

## 4. Migration Policy & Schema Change Approval
- Schema changes are only permitted via formal Migration scripts (e.g., Laravel Migrations / Prisma Migrations).
- All migrations must have a reliable `down()` rollback method.
- Dropping columns or tables requires Staff Engineer approval.

## 5. Soft Delete Policy
- All core business entities (`users`, `orders`, `products`) MUST implement soft deletes (`deleted_at`). Hard deletes are forbidden for these tables.

## 6. Audit Log Policy & Versioning Policy
- Changes to critical entities (Pricing, Stock, Order Status) must be tracked in an `audit_logs` table (who, what, when, old_value, new_value).

## 7. Naming Conventions
- Tables: snake_case, plural (`seller_profiles`).
- Pivot Tables: alphabetical, singular (`product_seller`).
- Booleans: prefix with `is_`, `has_`, or `can_` (e.g., `is_active`).

## 8. Database Performance Rules
- N+1 Queries are strictly forbidden. Use eager loading.
- Avoid `SELECT *`. Select only required columns.
