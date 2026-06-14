# Order Governance Constitution

This document strictly defines the lifecycle of an Order in Kadal2Kadaai, including permissible state transitions and ownership.

## 1. Official Order Lifecycle

| State | Description |
|---|---|
| `PLACED` | Order submitted, inventory reserved. |
| `PAYMENT_PENDING` | Awaiting gateway confirmation. |
| `PAYMENT_SUCCESS` | Gateway confirmed, awaiting seller. |
| `ACCEPTED` | Seller confirmed order. Inventory committed. |
| `PREPARING` | Seller is preparing the items. |
| `PACKED` | Items packed and ready for dispatch. |
| `OUT_FOR_DELIVERY` | Handed over to logistics partner. |
| `DELIVERED` | Handed over to consumer. |
| `CANCELLED` | Cancelled by consumer (if allowed) or seller. |
| `REFUNDED` | Payment returned. |
| `FAILED` | Payment failed or system error. |

## 2. Transition Governance

### Who Can Trigger & Allowed Transitions
- `Consumer`: `PLACED` -> `CANCELLED` (only if not yet ACCEPTED).
- `Payment Gateway`: `PAYMENT_PENDING` -> `PAYMENT_SUCCESS` or `FAILED`.
- `Seller`: `PAYMENT_SUCCESS` -> `ACCEPTED` or `CANCELLED`.
- `Seller`: `ACCEPTED` -> `PREPARING` -> `PACKED` -> `OUT_FOR_DELIVERY`.
- `Logistics`: `OUT_FOR_DELIVERY` -> `DELIVERED`.
- `Admin`: Can forcefully transition to `REFUNDED` or `CANCELLED` at any point for support reasons.

### Forbidden Transitions
- Cannot transition from `DELIVERED` to `CANCELLED`.
- Cannot skip `ACCEPTED` straight to `DELIVERED`.

## 3. Rollback & Realtime Rules
- **Rollback Rules**: Any cancellation before `DELIVERED` must trigger `Inventory Release` and `Payment Refund` flows automatically.
- **Notification Rules**: Every state change triggers an in-app and/or SMS notification to the relevant party.
- **Realtime Rules**: State changes are published to the websocket server to update Seller and Consumer screens instantly.
