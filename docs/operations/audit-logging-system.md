# Enterprise Audit Logging System

## 1. Core Principles
The Audit Logging system provides non-repudiation and traceability for all critical platform actions. Audit logs are **append-only** and **immutable**. They cannot be modified or deleted, even by SuperAdmins.

## 2. Tracked Actions
- **Admin Actions**: Setting changes, commission adjustments, user suspensions.
- **Seller Actions**: Shop updates, payout requests.
- **Inventory & Product Changes**: Price changes, stock manual overrides.
- **Order Changes**: Manual status overrides, refunds issued.
- **Security Actions**: Role changes, permission delegations.
- **CMS Changes**: Banner updates, policy modifications.

## 3. Log Schema
Every logged event MUST capture:
```json
{
  "audit_id": "uuid",
  "actor_id": "uuid", // Who
  "actor_type": "Admin | Seller | System",
  "action": "ORDER_REFUNDED", // What
  "entity_type": "Order",
  "entity_id": "uuid", // Where
  "previous_value": { "status": "DELIVERED" },
  "new_value": { "status": "REFUNDED" },
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...", // Device Information
  "timestamp": "2026-06-05T12:00:00Z" // When
}
```

## 4. Storage & Archival
Audit logs are stored in a dedicated, highly indexed PostgreSQL partition or a specialized NoSQL data store (e.g., DynamoDB). Logs older than 1 year are offloaded to cold storage (S3 Glacier) for compliance.
