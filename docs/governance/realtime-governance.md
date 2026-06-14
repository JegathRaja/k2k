# Realtime Event Constitution

This document defines the strict governance rules for asynchronous events and Realtime messaging within Kadal2Kadaai.

## 1. Official Event Catalog

| Event Name | Owner Domain | Subscribers |
|---|---|---|
| `PRODUCT_CREATED` | Product | SearchIndex, AdminAudit |
| `PRODUCT_UPDATED` | Product | SearchIndex, CartValidation |
| `PRODUCT_DELETED` | Product | SearchIndex, CartValidation |
| `STOCK_UPDATED` | Inventory | Catalog, Notification |
| `ORDER_CREATED` | Order | Inventory(Reserve), Notification(Seller) |
| `ORDER_ACCEPTED` | Order | Inventory(Commit), Notification(User) |
| `ORDER_PREPARING` | Order | Notification(User) |
| `ORDER_PACKED` | Order | Notification(User) |
| `ORDER_DISPATCHED` | Order | Notification(User), Logistics |
| `ORDER_DELIVERED` | Order | Notification(User), Accounting |
| `PAYMENT_SUCCESS` | Payment | Order(Fulfill), Accounting |
| `PAYMENT_FAILED` | Payment | Order(Cancel), Notification(User) |
| `SELLER_APPROVED` | Seller | Notification(Seller), Catalog |
| `SELLER_SUSPENDED`| Seller | Notification(Seller), Catalog(Hide) |

## 2. Event Payload Schema
- All payloads must be JSON.
- Every event must include: `event_id` (UUID), `timestamp` (ISO8601), `version` (int), and `data` (object).
- Payload shape must not introduce breaking changes without version bumping.

## 3. Reliability & Failure Policy
- **Retry Policy**: Subscribers must implement exponential backoff retries for transient failures (e.g., up to 3 retries).
- **Failure Policy**: If an event fails processing after retries, it MUST be pushed to a Dead Letter Queue (DLQ) for manual inspection. No silent drops.
- **Idempotency**: All event handlers must be idempotent. Processing the exact same event twice must yield the same system state.

## 4. Naming Rules & Event Versioning
- Format: `{ENTITY}_{ACTION_PAST_TENSE}` in UPPER_SNAKE_CASE.
- Events are immutable. Breaking changes require a new version number in the payload.
